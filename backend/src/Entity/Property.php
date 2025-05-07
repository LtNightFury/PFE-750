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
    #[Groups(['property:list', 'property:read','message:read'])]
    private ?int $id = null;

    #[ORM\OneToOne(cascade: ['persist', 'remove'])]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['property:list', 'property:read','message:read'])]
    private ?General $generalinfo = null;

    #[ORM\OneToOne(cascade: ['persist', 'remove'])]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['property:list', 'property:read'])]
    private ?Location $location = null;

    #[ORM\OneToOne(cascade: ['persist', 'remove'])]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['property:list', 'property:read'])]
    private ?Specification $Specification = null;

    #[ORM\OneToOne(cascade: ['persist', 'remove'])]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['property:list', 'property:read'])]
    private ?Price $price = null;

    #[ORM\OneToOne(cascade: ['persist', 'remove'])]
    #[ORM\JoinColumn(nullable: false)]
  
    #[Groups(['property:read'])]
    private ?Amenities $Amenities = null;

    #[ORM\OneToOne(cascade: ['persist', 'remove'])]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['property:read'])]
    
    private ?Contacts $contacts = null;

    #[ORM\ManyToOne(inversedBy: 'properties')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['property:read'])]
    private ?User $user = null;

    #[ORM\OneToOne(cascade: ['persist', 'remove'])]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['property:list', 'property:read'])]
    private ?Media $Media = null;

    #[ORM\Column(length: 255, options: ['default' => 'pending'])]
    private ?string $approval = 'pending';

    #[ORM\OneToMany(mappedBy: 'property', targetEntity: Booking::class, orphanRemoval: true)]
    #[Groups(['property:read'])]
    private Collection $bookings;

    #[ORM\OneToMany(mappedBy: 'property', targetEntity: Appointment::class)]
    private Collection $appointments;

    #[ORM\Column(nullable: true)]
    private ?int $viewCount = 0;

    #[ORM\OneToMany(mappedBy: 'Property', targetEntity: Message::class, orphanRemoval: true)]
    private Collection $messages;

    #[ORM\OneToMany(mappedBy: 'Property', targetEntity: PropertyView::class)]
    private Collection $propertyViews;

    public function __construct()
    {
        $this->bookings = new ArrayCollection();
        $this->appointments = new ArrayCollection();
        $this->messages = new ArrayCollection();
        $this->propertyViews = new ArrayCollection();
    }
    

    public function getId(): ?int
    {
        return $this->id;
    }
    public function incrementViewCount(): void
{
    $this->viewCount++;
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

    public function getViewCount(): ?int
    {
        
        return $this->propertyViews->count();
    }


    public function setViewCount(?int $viewCount): static
    {
        $this->viewCount = $viewCount;

        return $this;
    }

    /**
     * @return Collection<int, Message>
     */
    public function getMessages(): Collection
    {
        return $this->messages;
    }

    public function addMessage(Message $message): static
    {
        if (!$this->messages->contains($message)) {
            $this->messages->add($message);
            $message->setProperty($this);
        }

        return $this;
    }

    public function removeMessage(Message $message): static
    {
        if ($this->messages->removeElement($message)) {
            // set the owning side to null (unless already changed)
            if ($message->getProperty() === $this) {
                $message->setProperty(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, PropertyView>
     */
    public function getPropertyViews(): Collection
    {
        return $this->propertyViews;
    }

    public function addPropertyView(PropertyView $propertyView): static
    {
        if (!$this->propertyViews->contains($propertyView)) {
            $this->propertyViews->add($propertyView);
            $propertyView->setProperty($this);
        }

        return $this;
    }

    public function removePropertyView(PropertyView $propertyView): static
    {
        if ($this->propertyViews->removeElement($propertyView)) {
            // set the owning side to null (unless already changed)
            if ($propertyView->getProperty() === $this) {
                $propertyView->setProperty(null);
            }
        }

        return $this;
    }
}
