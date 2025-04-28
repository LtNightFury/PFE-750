<?php

namespace App\Entity;

use App\Repository\LocationRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: LocationRepository::class)]
class Location
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column]
    #[Groups(['property:read'])]
    private ?float $latitude = null;

    #[ORM\Column]
    #[Groups(['property:read'])]
    private ?float $longitude = null;


    #[ORM\Column(length: 255)]
    #[Groups(['property:read'])]
    private ?string $country = null;

    #[ORM\Column(length: 255)]
    #[Groups(['property:list', 'property:read'])]
    private ?string $city = null;

    #[ORM\Column(length: 255)]
    #[Groups(['property:list', 'property:read'])]
    private ?string $subcity = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getLatitude(): ?float
    {
        return $this->latitude;
    }

    public function setLatitude(float $latitude): static
    {
        $this->latitude = $latitude;

        return $this;
    }

    public function getLongitude(): ?float
    {
        return $this->longitude;
    }

    public function setLongitude(float $longitude): static
    {
        $this->longitude = $longitude;

        return $this;
    }

    public function getCountry(): ?string
    {
        return $this->country;
    }

    public function setCountry(string $country): static
    {
        $this->country = $country;

        return $this;
    }

    public function getCity(): ?string
    {
        return $this->city;
    }

    public function setCity(string $city): static
    {
        $this->city = $city;

        return $this;
    }

    public function getSubcity(): ?string
    {
        return $this->subcity;
    }

    public function setSubcity(string $subcity): static
    {
        $this->subcity = $subcity;

        return $this;
    }
}
