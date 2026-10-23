'use client';

import { useEffect, useRef, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Image from 'next/image';
import { createPlayer, updatePlayer, updatePlayerImage } from '@/lib/api/api';
import { uploadImageToCloudinary } from '@/lib/cloudinary';
import { Player } from '@/lib/types/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { Pencil } from 'lucide-react';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "view" | "edit" | "create";
  player?: Player;
};

export default function PlayerDialog({ open, onOpenChange, mode, player }: Props) {
  const queryClient = useQueryClient();

  const [name, setName] = useState<string>(player?.name ?? "");
  const [nickname, setNickname] = useState<string>(player?.nickname ?? "");
  const [image, setImage] = useState<string>(player?.image ?? "");
  const [imgError, setImgError] = useState<boolean>(false);
  const [localPreview, setLocalPreview] = useState<string>("");
  const [uploading, setUploading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    setName(player?.name ?? "");
    setNickname(player?.nickname ?? "");
    setImage(player?.image ?? "");
    setImgError(false);
    setLocalPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return "";
    });
    setUploading(false);
  }, [open, player]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    const objectUrl = URL.createObjectURL(file);
    setLocalPreview(objectUrl);
    setImgError(false);
    setUploading(true);

    try {
      const secureUrl = await uploadImageToCloudinary(file);
      setImage(secureUrl);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error subiendo la imagen");
    } finally {
      setUploading(false);
      URL.revokeObjectURL(objectUrl);
      setLocalPreview("");
    }
  };

  const createMutation = useMutation({
    mutationFn: () =>
      createPlayer({ name, nickname, image: image || undefined }),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["players"] });
      queryClient.invalidateQueries({ queryKey: ["players-stats"] });
      toast.success("Jugador creado");
      onOpenChange(false);
    },

    onError: (err: unknown) => {
      toast.error(err instanceof Error ? err.message : "Error creando jugador");
    },
  });

  const updateMutation = useMutation({
    mutationFn: async () => {
      if (name !== player!.name || nickname !== player!.nickname) {
        await updatePlayer(player!.id, { name, nickname });
      }

      if (image !== (player!.image ?? "")) {
        await updatePlayerImage(player!.id, image);
      }
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["players"] });
      queryClient.invalidateQueries({ queryKey: ["players-stats"] });
      toast.success("Jugador actualizado");
      onOpenChange(false);
    },

    onError: (err: unknown) => {
      toast.error(err instanceof Error ? err.message : "Error actualizando jugador");
    },
  });

  const isView = mode === "view";
  const isCreate = mode === "create";
  const isPending = createMutation.isPending || updateMutation.isPending;
  const canSubmit = !!name.trim() && !!nickname.trim();
  const avatarSrc = localPreview || image;

  const handleSubmit = () => {
    if (!canSubmit) return;

    if (isCreate) {
      createMutation.mutate();
    } else {
      updateMutation.mutate();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isView ? "Detalle del jugador" : isCreate ? "Agregar jugador" : "Editar jugador"}
          </DialogTitle>
          <DialogDescription className="sr-only">
            {isView ? "Detalle" : isCreate ? "Formulario para crear" : "Formulario para editar"} jugador
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div className="flex justify-center">
            <div className="relative">
              <Avatar className="relative h-20 w-20 overflow-hidden rounded-full">
                {!imgError && avatarSrc && (
                  <Image
                    src={avatarSrc}
                    alt={name}
                    fill
                    unoptimized
                    className="object-cover"
                    onError={() => setImgError(true)}
                  />
                )}

                <AvatarFallback>
                  {name.charAt(0) || "?"}
                </AvatarFallback>
              </Avatar>

              {uploading && (
                <div className="absolute inset-0 flex items-center justify-center rounded-full bg-background/70">
                  <Spinner />
                </div>
              )}

              {!isView && (
                <>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="absolute -bottom-1 -right-1 rounded-full border bg-background p-1.5 text-muted-foreground hover:bg-ring/10 hover:text-foreground disabled:opacity-50"
                  >
                    <Pencil className="size-3.5" />
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between gap-4">
            <span className="text-sm text-muted-foreground">Nombre</span>
            <Input
              className="h-8 w-52"
              value={name}
              disabled={isView}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-between gap-4">
            <span className="text-sm text-muted-foreground">Apodo</span>
            <Input
              className="h-8 w-52"
              value={nickname}
              disabled={isView}
              onChange={(e) => setNickname(e.target.value)}
            />
          </div>

        </div>

        <DialogFooter>
          {isView ? (
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cerrar
            </Button>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isPending}
              >
                Cancelar
              </Button>

              <Button
                className="gap-1.5"
                disabled={!canSubmit || isPending || uploading}
                onClick={handleSubmit}
              >
                {isPending && <Spinner />}
                {isCreate ? "Agregar" : "Guardar"}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
