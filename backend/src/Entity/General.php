<?php

namespace App\Entity;

use App\Repository\GeneralRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: GeneralRepository::class)]
#[ORM\Table(name: '`general`')]
class General
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(['property:list', 'property:read'])]
    private ?string $deal_type = null;

    #[ORM\Column(length: 255)]
    #[Groups(['property:list', 'property:read'])]
    private ?string $title = null;

    #[ORM\Column(length: 1000)]
    #[Groups(['property:read'])]
    private ?string $description = null;

    #[ORM\Column(length: 255)]
    #[Groups(['property:read'])]
    private ?string $PropertyCondition = null;

    #[ORM\Column(length: 255)]
    #[Groups(['property:list', 'property:read'])]
    private ?string $propertyType = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['property:read'])]
    private ?string $availabilityDate = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getDealType(): ?string
    {
        return $this->deal_type;
    }

    public function setDealType(string $deal_type): static
    {
        $this->deal_type = $deal_type;

        return $this;
    }

    public function getTitle(): ?string
    {
        return $this->title;
    }

    public function setTitle(string $title): static
    {
        $this->title = $title;

        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(string $description): static
    {
        $this->description = $description;

        return $this;
    }

    public function getPropertyCondition(): ?string
    {
        return $this->PropertyCondition;
    }

    public function setPropertyCondition(string $PropertyCondition): static
    {
        $this->PropertyCondition = $PropertyCondition;

        return $this;
    }

    public function getPropertyType(): ?string
    {
        return $this->propertyType;
    }

    public function setPropertyType(string $propertyType): static
    {
        $this->propertyType = $propertyType;

        return $this;
    }

    public function getAvailabilityDate(): ?string
    {
        return $this->availabilityDate;
    }

    public function setAvailabilityDate(?string $availabilityDate): static
    {
        $this->availabilityDate = $availabilityDate;

        return $this;
    }
}
