<?php

namespace App\Entity;

use App\Repository\PriceRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: PriceRepository::class)]
class Price
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(type: Types::BIGINT)]
    private ?string $price = null;

    #[ORM\Column(type: Types::BIGINT, nullable: true)]
    private ?string $pricesqft = null;

    #[ORM\Column(type: Types::BIGINT, nullable: true)]
    private ?string $originalprice = null;

    #[ORM\Column]
    private ?bool $hideprice = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $charges = null;

    #[ORM\Column(type: Types::BIGINT, nullable: true)]
    private ?string $servicecharge = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getPrice(): ?string
    {
        return $this->price;
    }

    public function setPrice(string $price): static
    {
        $this->price = $price;

        return $this;
    }

    public function getPricesqft(): ?string
    {
        return $this->pricesqft;
    }

    public function setPricesqft(?string $pricesqft): static
    {
        $this->pricesqft = $pricesqft;

        return $this;
    }

    public function getOriginalprice(): ?string
    {
        return $this->originalprice;
    }

    public function setOriginalprice(?string $originalprice): static
    {
        $this->originalprice = $originalprice;

        return $this;
    }

    public function isHideprice(): ?bool
    {
        return $this->hideprice;
    }

    public function setHideprice(bool $hideprice): static
    {
        $this->hideprice = $hideprice;

        return $this;
    }

    public function getCharges(): ?string
    {
        return $this->charges;
    }

    public function setCharges(?string $charges): static
    {
        $this->charges = $charges;

        return $this;
    }

    public function getServicecharge(): ?string
    {
        return $this->servicecharge;
    }

    public function setServicecharge(?string $servicecharge): static
    {
        $this->servicecharge = $servicecharge;

        return $this;
    }
}
