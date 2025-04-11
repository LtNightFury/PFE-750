<?php

namespace App\Entity;

use App\Repository\SpecificationRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: SpecificationRepository::class)]
class Specification
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $bedrooms = null;

    #[ORM\Column(length: 255)]
    private ?string $bathrooms = null;

    #[ORM\Column(length: 255)]
    private ?string $parkingSpots = null;

    #[ORM\Column(type: Types::BIGINT, nullable: true)]
    private ?string $size = null;

    #[ORM\Column(type: Types::BIGINT, nullable: true)]
    private ?string $plotSize = null;

    #[ORM\Column(type: Types::BIGINT, nullable: true)]
    private ?string $builtUpArea = null;

    #[ORM\Column(nullable: true)]
    private ?int $constructionYear = null;

    #[ORM\Column(nullable: true)]
    private ?int $Renovationyear = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $Furnishing = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getBedrooms(): ?string
    {
        return $this->bedrooms;
    }

    public function setBedrooms(string $bedrooms): static
    {
        $this->bedrooms = $bedrooms;

        return $this;
    }

    public function getBathrooms(): ?string
    {
        return $this->bathrooms;
    }

    public function setBathrooms(string $bathrooms): static
    {
        $this->bathrooms = $bathrooms;

        return $this;
    }

    public function getParkingSpots(): ?string
    {
        return $this->parkingSpots;
    }

    public function setParkingSpots(string $parkingSpots): static
    {
        $this->parkingSpots = $parkingSpots;

        return $this;
    }

    public function getSize(): ?string
    {
        return $this->size;
    }

    public function setSize(?string $size): static
    {
        $this->size = $size;

        return $this;
    }

    public function getPlotSize(): ?string
    {
        return $this->plotSize;
    }

    public function setPlotSize(?string $plotSize): static
    {
        $this->plotSize = $plotSize;

        return $this;
    }

    public function getBuiltUpArea(): ?string
    {
        return $this->builtUpArea;
    }

    public function setBuiltUpArea(?string $builtUpArea): static
    {
        $this->builtUpArea = $builtUpArea;

        return $this;
    }

    public function getConstructionYear(): ?int
    {
        return $this->constructionYear;
    }

    public function setConstructionYear(?int $constructionYear): static
    {
        $this->constructionYear = $constructionYear;

        return $this;
    }

    public function getRenovationyear(): ?int
    {
        return $this->Renovationyear;
    }

    public function setRenovationyear(?int $Renovationyear): static
    {
        $this->Renovationyear = $Renovationyear;

        return $this;
    }

    public function getFurnishing(): ?string
    {
        return $this->Furnishing;
    }

    public function setFurnishing(?string $Furnishing): static
    {
        $this->Furnishing = $Furnishing;

        return $this;
    }
}
