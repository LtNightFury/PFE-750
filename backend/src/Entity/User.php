<?php

namespace App\Entity;

use App\Repository\UserRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Validator\Constraints as Assert;
use Doctrine\Common\Collections\Collection;
use Doctrine\Common\Collections\ArrayCollection;
use Vich\UploaderBundle\Mapping\Annotation as Vich;
use Symfony\Component\HttpFoundation\File\File;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: UserRepository::class)]
#[ORM\Table(name: '`user`')]
#[Vich\Uploadable]
class User implements UserInterface, PasswordAuthenticatedUserInterface
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['admin:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 180, unique: true)]
    #[Assert\NotBlank]
    #[Assert\Email]
    #[Groups(['admin:read', 'property:read'])]
    private ?string $email = null;

    #[ORM\Column]
    #[Groups(['admin:read'])]
    private array $roles = [];

    #[ORM\Column]
    #[Groups(['admin:read'])]
    private ?string $password = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $resetToken = null;

    #[ORM\Column(type: 'string', length: 255, nullable: true)]
    #[Groups(['admin:read', 'property:read'])]
    private ?string $profileImage = null;

    #[Vich\UploadableField(mapping: 'User', fileNameProperty: 'profileImage')]
    #[Groups(['admin:read', 'property:read'])]
    private ?File $profileImageFile = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE, nullable: true)]
    #[Groups(['admin:read'])]
    private ?\DateTimeInterface $updatedAt = null;

    #[ORM\Column(type: 'datetime', nullable: true)]
    #[Groups(['admin:read'])]
    private ?\DateTimeInterface $resetTokenExpiresAt = null;



    #[ORM\Column(length: 255)]
    #[Assert\NotBlank]
    #[Groups(['admin:read', 'property:read'])]
    private ?string $name = null;

    #[ORM\OneToMany(mappedBy: 'user', targetEntity: Property::class)]
    private Collection $properties;

    #[ORM\OneToMany(mappedBy: 'user', targetEntity: Booking::class, orphanRemoval: true)]
    private Collection $bookings;

    #[ORM\OneToMany(mappedBy: 'owner', targetEntity: Contract::class)]
    private Collection $contracts;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['admin:read', 'property:read'])]
    private ?string $phoneNumber = null;

    #[ORM\OneToMany(mappedBy: 'user', targetEntity: Appointment::class)]
    private Collection $appointments;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['admin:read', 'property:read'])]
    private ?string $lastname = null;

    #[ORM\OneToMany(mappedBy: 'user', targetEntity: Contactus::class)]
    private Collection $contactuses;


    public function __construct()
    {

        $this->properties = new ArrayCollection();
        $this->bookings = new ArrayCollection();
        $this->contracts = new ArrayCollection();
        $this->appointments = new ArrayCollection();
        $this->contactuses = new ArrayCollection();
    }

    public function getName(): ?string
    {
        return $this->name;
    }
    
    public function getprofileImage(): ?string
    {
        return $this->profileImage 
            ? '/uploads/profile/' . $this->profileImage
            : null;
    }

    public function setName(string $name): static
    {
        $this->name = $name;

        return $this;
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): static
    {
        $this->email = $email;

        return $this;
    }

    public function getUserIdentifier(): string
    {
        return (string) $this->email;
    }

    public function getRoles(): array
    {
        $roles = $this->roles;
        // guarantee every user at least has ROLE_USER
        $roles[] = 'ROLE_USER';

        return array_unique($roles);
    }

    public function setRoles(array $roles): static
    {
        $this->roles = $roles;

        return $this;
    }

    public function getPassword(): string
    {
        return $this->password;
    }

    public function setPassword(string $password): static
    {
        $this->password = $password;

        return $this;
    }

    public function eraseCredentials(): void
    {
        // If you store any temporary, sensitive data on the user, clear it here
    }

    public function getSalt(): ?string
    {
        // Return null as the salt is not needed when using modern password hashing
        return null;
    }

    public function getUsername(): string
    {
        // This method is deprecated, redirect to getUserIdentifier() instead
        return $this->getUserIdentifier();
    }

    public function getResetToken(): ?string
    {
        return $this->resetToken;
    }

    public function setResetToken(?string $resetToken): static
    {
        $this->resetToken = $resetToken;
        
        return $this;
    }

    public function getResetTokenExpiresAt(): ?\DateTimeInterface
    {
        return $this->resetTokenExpiresAt;
    }

    public function setResetTokenExpiresAt(?\DateTimeInterface $resetTokenExpiresAt): static
    {
        $this->resetTokenExpiresAt = $resetTokenExpiresAt;
        
        return $this;
    }
    
    public function getUpdatedAt(): ?\DateTimeInterface
    {
        return $this->updatedAt;
    }

    public function setUpdatedAt(?\DateTimeInterface $updatedAt): static
    {
        $this->updatedAt = $updatedAt;
        
        return $this;
    }
    
    public function getProperties(): Collection
    {
        return $this->properties;
    }

    public function addProperty(Property $property): self
    {
        if (!$this->properties->contains($property)) {
            $this->properties[] = $property;
            $property->setUser($this);
        }

        return $this;
    }

    public function removeProperty(Property $property): self
    {
        if ($this->properties->removeElement($property)) {
            if ($property->getUser() === $this) {
                $property->setUser(null);
            }
        }

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
            $booking->setUser($this);
        }

        return $this;
    }

    public function removeBooking(Booking $booking): static
    {
        if ($this->bookings->removeElement($booking)) {
            // set the owning side to null (unless already changed)
            if ($booking->getUser() === $this) {
                $booking->setUser(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Contract>
     */
    public function getContracts(): Collection
    {
        return $this->contracts;
    }

    public function addContract(Contract $contract): static
    {
        if (!$this->contracts->contains($contract)) {
            $this->contracts->add($contract);
            $contract->setOwner($this);
        }

        return $this;
    }

    public function removeContract(Contract $contract): static
    {
        if ($this->contracts->removeElement($contract)) {
            // set the owning side to null (unless already changed)
            if ($contract->getOwner() === $this) {
                $contract->setOwner(null);
            }
        }

        return $this;
    }
    
    public function setProfileImageFile(?File $file = null): void
    {
        $this->profileImageFile = $file;

        // If a new file is uploaded, update the timestamp to force Doctrine to save changes
        if ($file) {
            $this->updatedAt = new \DateTime();
        }
    }
    
    public function getProfileImageFile(): ?File
    {
        return $this->profileImageFile;
    }
    
    public function setProfileImage(?string $image): void
    {
        $this->profileImage = $image;
    }

    public function getPhoneNumber(): ?string
    {
        return $this->phoneNumber;
    }

    public function setPhoneNumber(?string $phoneNumber): static
    {
        $this->phoneNumber = $phoneNumber;

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
            $appointment->setUser($this);
        }

        return $this;
    }

    public function removeAppointment(Appointment $appointment): static
    {
        if ($this->appointments->removeElement($appointment)) {
            // set the owning side to null (unless already changed)
            if ($appointment->getUser() === $this) {
                $appointment->setUser(null);
            }
        }

        return $this;
    }

    public function getLastname(): ?string
    {
        return $this->lastname;
    }

    public function setLastname(?string $lastname): static
    {
        $this->lastname = $lastname;

        return $this;
    }

    /**
     * @return Collection<int, Contactus>
     */
    public function getContactuses(): Collection
    {
        return $this->contactuses;
    }

    public function addContactus(Contactus $contactus): static
    {
        if (!$this->contactuses->contains($contactus)) {
            $this->contactuses->add($contactus);
            $contactus->setUser($this);
        }

        return $this;
    }

    public function removeContactus(Contactus $contactus): static
    {
        if ($this->contactuses->removeElement($contactus)) {
            // set the owning side to null (unless already changed)
            if ($contactus->getUser() === $this) {
                $contactus->setUser(null);
            }
        }

        return $this;
    }
}