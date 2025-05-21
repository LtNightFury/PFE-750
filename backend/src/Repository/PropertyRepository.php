<?php

namespace App\Repository;

use App\Entity\Property;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;
use App\Repository\GeneralRepository;
use App\Repository\LocationRepository;
use App\Repository\specifcationRepository;
use App\Repository\PriceRepository;
use App\Repository\AmenitiesRepository;
use App\Repository\ContactsRepository;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use App\Repository\PhotosRepository;
use App\Repository\MediaRepository;


/**
 * @extends ServiceEntityRepository<Property>
 *
 * @method Property|null find($id, $lockMode = null, $lockVersion = null)
 * @method Property|null findOneBy(array $criteria, array $orderBy = null)
 * @method Property[]    findAll()
 * @method Property[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class PropertyRepository extends ServiceEntityRepository
{   
    private $generalRepository;
    private $locationRepository;
    private $SpecificationRepository;
    private $priceRepository;
    private $amenitiesRepository;
    private $contactsRepository;
    private $MediaRepository;
    private $photosRepository;
    
    public function __construct(ManagerRegistry $registry,GeneralRepository $generalRepository,LocationRepository $locationRepository,SpecificationRepository $SpecificationRepository,PriceRepository $PriceRepository,
    AmenitiesRepository $amenitiesRepository,
    ContactsRepository $contactsRepository,
    MediaRepository $MediaRepository,
    )
    
    {
        $this->generalRepository = $generalRepository;
        $this->locationRepository = $locationRepository;
        $this->SpecificationRepository = $SpecificationRepository;
        $this->priceRepository = $PriceRepository;
        $this->amenitiesRepository = $amenitiesRepository;
        $this->contactsRepository = $contactsRepository;
        $this->MediaRepository = $MediaRepository;
        
        parent::__construct($registry, Property::class);
    }

//    /**
//     * @return Property[] Returns an array of Property objects
//     */
//    public function findByExampleField($value): array
//    {
//        return $this->createQueryBuilder('p')
//            ->andWhere('p.exampleField = :val')
//            ->setParameter('val', $value)
//            ->orderBy('p.id', 'ASC')
//            ->setMaxResults(10)
//            ->getQuery()
//            ->getResult()
//        ;
//    }

//    public function findOneBySomeField($value): ?Property
//    {
//        return $this->createQueryBuilder('p')
//            ->andWhere('p.exampleField = :val')
//            ->setParameter('val', $value)
//            ->getQuery()
//            ->getOneOrNullResult()
//        ;
//    }
public function createProperty($data,$user): Property
{
    

    
    $general = $this->generalRepository->addGeneral($data['general']);
    $location = $this->locationRepository->addLocation($data['location']);
    $specification = $this->SpecificationRepository->addSpecification($data['specification']);
    $price = $this->priceRepository->addPrice($data['price']);

    $amenitiesData = $data['amenities'] ?? [];
    $amenities = $this->amenitiesRepository->addAmenities($amenitiesData['amenities'] ?? []);
    $contacts = $this->contactsRepository->addContact($data['contacts']);
    $media = $this->MediaRepository->createMediaWithPhotos($data['mediaFiles']);
    

    
    $property = new Property();
    $property->setGeneralinfo($general);
    $property->setLocation($location);
    $property->setSpecification($specification);
    $property->setPrice($price);
    $property->setAmenities($amenities);
    $property->setContacts($contacts);
    $property->setUser($user);
    $property->setMedia($media);
    
    // optionally persist with entity manager
    $this->getEntityManager()->persist($property);
    $this->getEntityManager()->flush();

    return $property;
}
public function updateProperty(Property $property, $data, $user): Property
{
    // Check if the user is the owner of the property
    if ($property->getUser() !== $user) {
        throw new \Exception('You are not authorized to update this property');
    }
    
    // Update related entities if they exist in the data
    if (isset($data['general'])) {
        $this->generalRepository->updateGeneral($property->getGeneralinfo(), $data['general']);
    }
    
    if (isset($data['location'])) {
        $this->locationRepository->updateLocation($property->getLocation(), $data['location']);
    }
    
    if (isset($data['specification'])) {
        $this->SpecificationRepository->updateSpecification($property->getSpecification(), $data['specification']);
    }
    
    if (isset($data['price'])) {
        $this->priceRepository->updatePrice($property->getPrice(), $data['price']);
    }
    
    if (isset($data['amenities']) && isset($data['amenities']['amenities'])) {
        $this->amenitiesRepository->updateAmenities($property->getAmenities(), $data['amenities']['amenities']);
    }
    
    if (isset($data['contacts'])) {
        $this->contactsRepository->updateContacts($property->getContacts(), $data['contacts']);
    }
    
    // Handle media files updates if they exist
    if (isset($data['mediaFiles'])) {
        $this->MediaRepository->updateMedia($property->getMedia(), $data['mediaFiles']);
    }
    
    // No need to persist the property itself as we're just updating its related entities
    $this->getEntityManager()->flush();
    
    return $property;
}
public function countPropertiesPerMonth(): array
{
    $conn = $this->getEntityManager()->getConnection();

    $sql = "
        SELECT 
            DATE_FORMAT(created_at, '%Y-%m') AS date,
            COUNT(*) AS count
        FROM property
        GROUP BY date
        ORDER BY date ASC
    ";

    $stmt = $conn->prepare($sql);
    $resultSet = $stmt->executeQuery();

    return $resultSet->fetchAllAssociative();
}



}