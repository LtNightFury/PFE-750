<?php

namespace App\Entity;

use App\Repository\AmenitiesRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: AmenitiesRepository::class)]
class Amenities
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column]
    private ?bool $centralAC = null;

    #[ORM\Column]
    private ?bool $parking = null;

    #[ORM\Column]
    private ?bool $elevator = null;

    #[ORM\Column]
    private ?bool $petsAllowed = null;

    #[ORM\Column]
    private ?bool $conciergeService = null;

    #[ORM\Column]
    private ?bool $securityService = null;

    #[ORM\Column]
    private ?bool $lobbyInBuilding = null;

    #[ORM\Column]
    private ?bool $maidsRoom = null;

    #[ORM\Column]
    private ?bool $studyRoom = null;

    #[ORM\Column]
    private ?bool $balcony = null;

    #[ORM\Column]
    private ?bool $walkInCloset = null;

    #[ORM\Column]
    private ?bool $childrensPlayArea = null;

    #[ORM\Column]
    private ?bool $garden = null;

    #[ORM\Column]
    private ?bool $barbecueArea = null;

    #[ORM\Column]
    private ?bool $jacuzzi = null;

    #[ORM\Column]
    private ?bool $sauna = null;

    #[ORM\Column]
    private ?bool $sharedGym = null;

    #[ORM\Column]
    private ?bool $privateGym = null;

    #[ORM\Column]
    private ?bool $sharedPool = null;

    #[ORM\Column]
    private ?bool $privatePool = null;

    #[ORM\Column]
    private ?bool $spa = null;

    #[ORM\Column]
    private ?bool $viewOfWater = null;

    #[ORM\Column]
    private ?bool $viewOfLandmark = null;

    #[ORM\Column]
    private ?bool $nearbyHospitals = null;

    #[ORM\Column]
    private ?bool $nearbyPublicTransport = null;

    #[ORM\Column]
    private ?bool $nearbySchools = null;

    #[ORM\Column]
    private ?bool $nearbyShopping = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function isCentralAC(): ?bool
    {
        return $this->centralAC;
    }

    public function setCentralAC(bool $centralAC): static
    {
        $this->centralAC = $centralAC;

        return $this;
    }

    public function isParking(): ?bool
    {
        return $this->parking;
    }

    public function setParking(bool $parking): static
    {
        $this->parking = $parking;

        return $this;
    }

    public function isElevator(): ?bool
    {
        return $this->elevator;
    }

    public function setElevator(bool $elevator): static
    {
        $this->elevator = $elevator;

        return $this;
    }

    public function isPetsAllowed(): ?bool
    {
        return $this->petsAllowed;
    }

    public function setPetsAllowed(bool $petsAllowed): static
    {
        $this->petsAllowed = $petsAllowed;

        return $this;
    }

    public function isConciergeService(): ?bool
    {
        return $this->conciergeService;
    }

    public function setConciergeService(bool $conciergeService): static
    {
        $this->conciergeService = $conciergeService;

        return $this;
    }

    public function isSecurityService(): ?bool
    {
        return $this->securityService;
    }

    public function setSecurityService(bool $securityService): static
    {
        $this->securityService = $securityService;

        return $this;
    }

    public function isLobbyInBuilding(): ?bool
    {
        return $this->lobbyInBuilding;
    }

    public function setLobbyInBuilding(bool $lobbyInBuilding): static
    {
        $this->lobbyInBuilding = $lobbyInBuilding;

        return $this;
    }

    public function isMaidsRoom(): ?bool
    {
        return $this->maidsRoom;
    }

    public function setMaidsRoom(bool $maidsRoom): static
    {
        $this->maidsRoom = $maidsRoom;

        return $this;
    }

    public function isStudyRoom(): ?bool
    {
        return $this->studyRoom;
    }

    public function setStudyRoom(bool $studyRoom): static
    {
        $this->studyRoom = $studyRoom;

        return $this;
    }

    public function isBalcony(): ?bool
    {
        return $this->balcony;
    }

    public function setBalcony(bool $balcony): static
    {
        $this->balcony = $balcony;

        return $this;
    }

    public function isWalkInCloset(): ?bool
    {
        return $this->walkInCloset;
    }

    public function setWalkInCloset(bool $walkInCloset): static
    {
        $this->walkInCloset = $walkInCloset;

        return $this;
    }

    public function isChildrensPlayArea(): ?bool
    {
        return $this->childrensPlayArea;
    }

    public function setChildrensPlayArea(bool $childrensPlayArea): static
    {
        $this->childrensPlayArea = $childrensPlayArea;

        return $this;
    }

    public function isGarden(): ?bool
    {
        return $this->garden;
    }

    public function setGarden(bool $garden): static
    {
        $this->garden = $garden;

        return $this;
    }

    public function isBarbecueArea(): ?bool
    {
        return $this->barbecueArea;
    }

    public function setBarbecueArea(bool $barbecueArea): static
    {
        $this->barbecueArea = $barbecueArea;

        return $this;
    }

    public function isJacuzzi(): ?bool
    {
        return $this->jacuzzi;
    }

    public function setJacuzzi(bool $jacuzzi): static
    {
        $this->jacuzzi = $jacuzzi;

        return $this;
    }

    public function isSauna(): ?bool
    {
        return $this->sauna;
    }

    public function setSauna(bool $sauna): static
    {
        $this->sauna = $sauna;

        return $this;
    }

    public function isSharedGym(): ?bool
    {
        return $this->sharedGym;
    }

    public function setSharedGym(bool $sharedGym): static
    {
        $this->sharedGym = $sharedGym;

        return $this;
    }

    public function isPrivateGym(): ?bool
    {
        return $this->privateGym;
    }

    public function setPrivateGym(bool $privateGym): static
    {
        $this->privateGym = $privateGym;

        return $this;
    }

    public function isSharedPool(): ?bool
    {
        return $this->sharedPool;
    }

    public function setSharedPool(bool $sharedPool): static
    {
        $this->sharedPool = $sharedPool;

        return $this;
    }

    public function isPrivatePool(): ?bool
    {
        return $this->privatePool;
    }

    public function setPrivatePool(bool $privatePool): static
    {
        $this->privatePool = $privatePool;

        return $this;
    }

    public function isSpa(): ?bool
    {
        return $this->spa;
    }

    public function setSpa(bool $spa): static
    {
        $this->spa = $spa;

        return $this;
    }

    public function isViewOfWater(): ?bool
    {
        return $this->viewOfWater;
    }

    public function setViewOfWater(bool $viewOfWater): static
    {
        $this->viewOfWater = $viewOfWater;

        return $this;
    }

    public function isViewOfLandmark(): ?bool
    {
        return $this->viewOfLandmark;
    }

    public function setViewOfLandmark(bool $viewOfLandmark): static
    {
        $this->viewOfLandmark = $viewOfLandmark;

        return $this;
    }

    public function isNearbyHospitals(): ?bool
    {
        return $this->nearbyHospitals;
    }

    public function setNearbyHospitals(bool $nearbyHospitals): static
    {
        $this->nearbyHospitals = $nearbyHospitals;

        return $this;
    }

    public function isNearbyPublicTransport(): ?bool
    {
        return $this->nearbyPublicTransport;
    }

    public function setNearbyPublicTransport(bool $nearbyPublicTransport): static
    {
        $this->nearbyPublicTransport = $nearbyPublicTransport;

        return $this;
    }

    public function isNearbySchools(): ?bool
    {
        return $this->nearbySchools;
    }

    public function setNearbySchools(bool $nearbySchools): static
    {
        $this->nearbySchools = $nearbySchools;

        return $this;
    }

    public function isNearbyShopping(): ?bool
    {
        return $this->nearbyShopping;
    }

    public function setNearbyShopping(bool $nearbyShopping): static
    {
        $this->nearbyShopping = $nearbyShopping;

        return $this;
    }
}
