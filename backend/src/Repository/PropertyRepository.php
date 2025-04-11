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
    public function __construct(ManagerRegistry $registry,GeneralRepository $generalRepository,LocationRepository $locationRepository,SpecificationRepository $SpecificationRepository,PriceRepository $PriceRepository,
    AmenitiesRepository $amenitiesRepository,
    ContactsRepository $contactsRepository)
    {
        $this->generalRepository = $generalRepository;
        $this->locationRepository = $locationRepository;
        $this->SpecificationRepository = $SpecificationRepository;
        $this->priceRepository = $PriceRepository;
        $this->amenitiesRepository = $amenitiesRepository;
        $this->contactsRepository = $contactsRepository;
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
    $amenities = $this->amenitiesRepository->addAmenities($data['amenities']['amenities']);
    $contacts = $this->contactsRepository->addContact($data['contacts']);

    
    $property = new Property();
    $property->setGeneralinfo($general);
    $property->setLocation($location);
    $property->setSpecification($specification);
    $property->setPrice($price);
    $property->setAmenities($amenities);
    $property->setContacts($contacts);
    $property->setUser($user);
    // optionally persist with entity manager
    $this->getEntityManager()->persist($property);
    $this->getEntityManager()->flush();

    return $property;
}


}