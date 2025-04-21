<?php

namespace App\Entity;

use App\Repository\PropertyRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

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

    #[ORM\ManyToOne(inversedBy: 'properties')]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $user = null;

    #[ORM\OneToOne(cascade: ['persist', 'remove'])]
    #[ORM\JoinColumn(nullable: false)]
    private ?Media $Media = null;

    #[ORM\Column(length: 255, options: ['default' => 'pending'])]
    private ?string $approval = 'pending';

    #[ORM\OneToMany(mappedBy: 'property', targetEntity: Booking::class, orphanRemoval: true)]
    private Collection $bookings;

    #[ORM\OneToMany(mappedBy: 'property', targetEntity: Appointment::class)]
    private Collection $appointments;

    public function __construct()
    {
        $this->bookings = new ArrayCollection();
        $this->appointments = new ArrayCollection();
    }
    

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
    public function getUser(): ?User
    {
    return $this->user;
    }

    public function setUser(?User $user): self
    {
    $this->user = $user;
    return $this;
    }

    public function getMedia(): ?Media
    {
        return $this->Media;
    }

    public function setMedia(Media $Media): static
    {
        $this->Media = $Media;

        return $this;
    }

    public function getApproval(): ?string
    {
        return $this->approval;
    }

    public function setApproval(string $approval): static
    {
        $this->approval = $approval;

        return $this;
    }

    /**
     * @return Collection<int, Booking>
     */
    public function getBookings(): Collection
    {
        return $this->bookings;
    }

    public function addBooking(Booking $booking): static
    {
        if (!$this->bookings->contains($booking)) {
            $this->bookings->add($booking);
            $booking->setProperty($this);
        }

        return $this;
    }

    public function removeBooking(Booking $booking): static
    {
        if ($this->bookings->removeElement($booking)) {
            // set the owning side to null (unless already changed)
            if ($booking->getProperty() === $this) {
                $booking->setProperty(null);
            }
        }

        return $this;
    }
    #[Groups(['property:read'])]
    public function getUserName(): ?string
    {
        return $this->user ? $this->user->getName() : null;
    }

    /**
     * @return Collection<int, Appointment>
     */
    public function getAppointments(): Collection
    {
        return $this->appointments;
    }

    public function addAppointment(Appointment $appointment): static
    {
        if (!$this->appointments->contains($appointment)) {
            $this->appointments->add($appointment);
            $appointment->setProperty($this);
        }

        return $this;
    }

    public function removeAppointment(Appointment $appointment): static
    {
        if ($this->appointments->removeElement($appointment)) {
            // set the owning side to null (unless already changed)
            if ($appointment->getProperty() === $this) {
                $appointment->setProperty(null);
            }
        }

        return $this;
    }
}
