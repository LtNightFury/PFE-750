<?php

namespace App\Entity;

use App\Repository\PropertyRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: PropertyRepository::class)]
class Property
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\OneToOne(cascade: ['persist', 'remove'])]
    #[ORM\JoinColumn(nullable: false)]
    private ?General $generalinfo = null;

    #[ORM\OneToOne(cascade: ['persist', 'remove'])]
    #[ORM\JoinColumn(nullable: false)]
    private ?Location $location = null;

    #[ORM\OneToOne(cascade: ['persist', 'remove'])]
    #[ORM\JoinColumn(nullable: false)]
    private ?Specification $Specification = null;

    #[ORM\OneToOne(cascade: ['persist', 'remove'])]
    #[ORM\JoinColumn(nullable: false)]
    private ?Price $price = null;

    #[ORM\OneToOne(cascade: ['persist', 'remove'])]
    #[ORM\JoinColumn(nullable: false)]
    private ?Amenities $Amenities = null;

    #[ORM\OneToOne(cascade: ['persist', 'remove'])]
    #[ORM\JoinColumn(nullable: false)]
    private ?Contacts $contacts = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getGeneralinfo(): ?General
    {
        return $this->generalinfo;
    }

    public function setGeneralinfo(General $generalinfo): static
    {
        $this->generalinfo = $generalinfo;

        return $this;
    }

    public function getLocation(): ?Location
    {
        return $this->location;
    }

    public function setLocation(Location $location): static
    {
        $this->location = $location;

        return $this;
    }

    public function getSpecification(): ?Specification
    {
        return $this->Specification;
    }

    public function setSpecification(Specification $Specification): static
    {
        $this->Specification = $Specification;

        return $this;
    }

    public function getPrice(): ?Price
    {
        return $this->price;
    }

    public function setPrice(Price $price): static
    {
        $this->price = $price;

        return $this;
    }

    public function getAmenities(): ?Amenities
    {
        return $this->Amenities;
    }

    public function setAmenities(Amenities $Amenities): static
    {
        $this->Amenities = $Amenities;

        return $this;
    }

    public function getContacts(): ?Contacts
    {
        return $this->contacts;
    }

    public function setContacts(Contacts $contacts): static
    {
        $this->contacts = $contacts;

        return $this;
    }
}
