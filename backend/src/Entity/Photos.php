<?php

namespace App\Entity;

use App\Repository\PhotosRepository;
use Doctrine\ORM\Mapping as ORM;
use Vich\UploaderBundle\Mapping\Annotation as Vich;
use Symfony\Component\HttpFoundation\File\File;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: PhotosRepository::class)]
#[Vich\Uploadable]
class Photos
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[Vich\UploadableField(mapping: 'Photos', fileNameProperty: 'imageName', size: 'imageSize')]
    private ?File $imageFile = null;

    #[ORM\Column(nullable: true)]
    #[Groups(['property:list', 'property:read'])]
    private ?string $imageName = null;

    #[ORM\Column(nullable: true)]
    private ?int $imageSize = null;

    #[ORM\Column(nullable: true)]
    private ?\DateTimeImmutable $updatedAt = null;

    #[ORM\ManyToOne(inversedBy: 'photos')]
    #[ORM\JoinColumn(nullable: false,onDelete: 'CASCADE')]
    private ?Media $media = null;

    public function getId(): ?int
    {
        return $this->id;
    }

     public function getImageFile(): ?File
    {
        return $this->imageFile;
    }

    public function setImageName(?string $imageName): void
    {
        $this->imageName = $imageName;
    }

    public function getImageName(): ?string
    {
        
            return $this->imageName 
                ? '/uploads/photos/' . $this->imageName
                : null;
        
    }

    public function setImageSize(?int $imageSize): void
    {
        $this->imageSize = $imageSize;
    }

    public function getImageSize(): ?int
    {
        return $this->imageSize;
    }

    public function getMedia(): ?Media
    {
        return $this->media;
    }

    public function setMedia(?Media $media): static
    {
        $this->media = $media;

        return $this;
    }
    public function setImageFile(?File $imageFile = null): void
{
    $this->imageFile = $imageFile;
    
    if ($imageFile) {
        // It's required to update the 'updatedAt' field when the file changes
        $this->updatedAt = new \DateTimeImmutable();
    }
}

public function setUpdatedAt(?\DateTimeImmutable $updatedAt): void
{
    $this->updatedAt = $updatedAt;
}

public function getUpdatedAt(): ?\DateTimeImmutable
{
    return $this->updatedAt;
}
}
