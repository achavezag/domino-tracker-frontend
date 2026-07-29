import Image from 'next/image';

export default function HeaderImage() {
  return (
    <div style={{ width: "100%", height: "100px", position: "relative" }}>
      <Image
        src="/domino_banner.jpg"
        alt="header"
        loading="eager"
        fill
        style={{ objectFit: "fill" }}
      />
    </div>
  )
}