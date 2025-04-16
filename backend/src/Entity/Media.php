<?php

namespace App\Entity;

use App\Repository\MediaRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: MediaRepository::class)]
class Media
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\OneToMany(mappedBy: 'media', targetEntity: Photos::class, cascade: ['persist', 'remove'], orphanRemoval: true)]
    private Collection $photos;

    #[ORM\OneToMany(mappedBy: 'media', targetEntity: FloorPlans::class,cascade: ['persist', 'remove'], orphanRemoval: true)]
    private Collection $floorPlans;

    #[ORM\OneToMany(mappedBy: 'media', targetEntity: Documents::class,cascade: ['persist', 'remove'], orphanRemoval: true)]
    private Collection $documents;

    public function __construct()
    {
        $this->photos = new ArrayCollection();
        $this->floorPlans = new ArrayCollection();
        $this->documents = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    /**
     * @return Collection<int, Photos>
     */
    public function getPhotos(): Collection
    {
        return $this->photos;
    }

    public function addPhoto(Photos $photo): static
    {
        if (!$this->photos->contains($photo)) {
            $this->photos->add($photo);
            $photo->setMedia($this);
        }

        return $this;
    }

    public function removePhoto(Photos $photo): static
    {
        if ($this->photos->removeElement($photo)) {
            // set the owning side to null (unless already changed)
            if ($photo->getMedia() === $this) {
                $photo->setMedia(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, FloorPlans>
     */
    public function getFloorPlans(): Collection
    {
        return $this->floorPlans;
    }

    public function addFloorPlan(FloorPlans $floorPlan): static
    {
        if (!$this->floorPlans->contains($floorPlan)) {
            $this->floorPlans->add($floorPlan);
            $floorPlan->setMedia($this);
        }

        return $this;
    }

    public function removeFloorPlan(FloorPlans $floorPlan): static
    {
        if ($this->floorPlans->removeElement($floorPlan)) {
            // set the owning side to null (unless already changed)
            if ($floorPlan->getMedia() === $this) {
                $floorPlan->setMedia(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Documents>
     */
    public function getDocuments(): Collection
    {
        return $this->documents;
    }

    public function addDocument(Documents $document): static
    {
        if (!$this->documents->contains($document)) {
            $this->documents->add($document);
            $document->setMedia($this);
        }

        return $this;
    }

    public function removeDocument(Documents $document): static
    {
        if ($this->documents->removeElement($document)) {
            // set the owning side to null (unless already changed)
            if ($document->getMedia() === $this) {
                $document->setMedia(null);
            }
        }

        return $this;
    }
}
