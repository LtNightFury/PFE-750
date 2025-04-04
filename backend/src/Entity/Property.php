<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\PropertyRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: PropertyRepository::class)]
#[ApiResource]
class Property
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(type: "string", length: 255)]
    private ?string $title = null;

    #[ORM\Column(type: "string", length: 255)]
    private ?string $type = null;

    #[ORM\Column(type: "text")]
    private ?string $description = null;

    #[ORM\Column(type: "float")]
    private ?float $price = null;

    #[ORM\Column(type: "string", length: 50)]
    private ?string $size = null;

    #[ORM\Column(type: "string", length: 20)]
    private ?string $status = null; // Rent or Sale

    #[ORM\Column(type: "float")]
    private ?float $latitude = null;

    #[ORM\Column(type: "float")]
    private ?float $longitude = null;

    #[ORM\Column(type: "integer")]
    private ?int $yearBuilt = null;

    #[ORM\Column(type: "datetime", nullable: true)]
    private ?\DateTimeInterface $isAvailableDate = null; // For rent only

    #[ORM\Column(type: "json")]
    private array $photos = [];

    #[ORM\Column(type: "integer")]
    private ?int $nbreRooms = null;

    #[ORM\Column(type: "integer")]
    private ?int $nbreBath = null;

    #[ORM\Column(type: "integer")]
    private ?int $nbreofParking = null;

    #[ORM\Column(type: "json")]
    private array $amenities = []; // Garage, Pool, Gym, etc.

    #[ORM\Column(type: "string", length: 255, nullable: true)]
    private ?string $videoTour = null; // Link to YouTube video

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getTitle(): ?string
    {
        return $this->title;
    }

    public function setTitle(string $title): self
    {
        $this->title = $title;
        return $this;
    }

    public function getType(): ?string
    {
        return $this->type;
    }

    public function setType(string $type): self
    {
        $this->type = $type;
        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(string $description): self
    {
        $this->description = $description;
        return $this;
    }

    public function getPrice(): ?float
    {
        return $this->price;
    }

    public function setPrice(float $price): self
    {
        $this->price = $price;
        return $this;
    }

    public function getSize(): ?string
    {
        return $this->size;
    }

    public function setSize(string $size): self
    {
        $this->size = $size;
        return $this;
    }

    public function getStatus(): ?string
    {
        return $this->status;
    }

    public function setStatus(string $status): self
    {
        $this->status = $status;
        return $this;
    }

    public function getLatitude(): ?float
    {
        return $this->latitude;
    }

    public function setLatitude(float $latitude): self
    {
        $this->latitude = $latitude;
        return $this;
    }

    public function getLongitude(): ?float
    {
        return $this->longitude;
    }

    public function setLongitude(float $longitude): self
    {
        $this->longitude = $longitude;
        return $this;
    }

    public function getYearBuilt(): ?int
    {
        return $this->yearBuilt;
    }

    public function setYearBuilt(int $yearBuilt): self
    {
        $this->yearBuilt = $yearBuilt;
        return $this;
    }

    public function getIsAvailableDate(): ?\DateTimeInterface
    {
        return $this->isAvailableDate;
    }

    public function setIsAvailableDate(?\DateTimeInterface $isAvailableDate): self
    {
        $this->isAvailableDate = $isAvailableDate;
        return $this;
    }

    public function getPhotos(): ?array
    {
        return $this->photos;
    }

    public function setPhotos(array $photos): self
    {
        $this->photos = $photos;
        return $this;
    }

    public function getNbreRooms(): ?int
    {
        return $this->nbreRooms;
    }

    public function setNbreRooms(int $nbreRooms): self
    {
        $this->nbreRooms = $nbreRooms;
        return $this;
    }

    public function getNbreBath(): ?int
    {
        return $this->nbreBath;
    }

    public function setNbreBath(int $nbreBath): self
    {
        $this->nbreBath = $nbreBath;
        return $this;
    }

    public function getNbreofParking(): ?int
    {
        return $this->nbreofParking;
    }

    public function setNbreofParking(int $nbreofParking): self
    {
        $this->nbreofParking = $nbreofParking;
        return $this;
    }

    public function getAmenities(): ?array
    {
        return $this->amenities;
    }

    public function setAmenities(array $amenities): self
    {
        $this->amenities = $amenities;
        return $this;
    }

    public function getVideoTour(): ?string
    {
        return $this->videoTour;
    }

    public function setVideoTour(?string $videoTour): self
    {
        $this->videoTour = $videoTour;
        return $this;
    }
}
