<?php

namespace App\Entity;

use App\Repository\PropertyViewRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;


#[ORM\Entity(repositoryClass: PropertyViewRepository::class)]
class PropertyView
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'propertyViews')]
    private ?User $user = null;

    #[ORM\ManyToOne(inversedBy: 'propertyViews')]
    private ?Property $Property = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    private ?\DateTimeInterface $viewedAt = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(?User $user): static
    {
        $this->user = $user;

        return $this;
    }

    public function getProperty(): ?Property
    {
        return $this->Property;
    }

    public function setProperty(?Property $Property): static
    {
        $this->Property = $Property;

        return $this;
    }

    public function getViewedAt(): ?\DateTimeInterface
    {
        return $this->viewedAt;
    }

    public function setViewedAt(\DateTimeInterface $viewedAt): static
    {
        $this->viewedAt = $viewedAt;

        return $this;
    }
}
