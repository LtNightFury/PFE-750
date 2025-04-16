<?php

namespace App\Repository;

use App\Entity\Amenities;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Amenities>
 *
 * @method Amenities|null find($id, $lockMode = null, $lockVersion = null)
 * @method Amenities|null findOneBy(array $criteria, array $orderBy = null)
 * @method Amenities[]    findAll()
 * @method Amenities[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class AmenitiesRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Amenities::class);
    }

//    /**
//     * @return Amenities[] Returns an array of Amenities objects
//     */
//    public function findByExampleField($value): array
//    {
//        return $this->createQueryBuilder('a')
//            ->andWhere('a.exampleField = :val')
//            ->setParameter('val', $value)
//            ->orderBy('a.id', 'ASC')
//            ->setMaxResults(10)
//            ->getQuery()
//            ->getResult()
//        ;
//    }

//    public function findOneBySomeField($value): ?Amenities
//    {
//        return $this->createQueryBuilder('a')
//            ->andWhere('a.exampleField = :val')
//            ->setParameter('val', $value)
//            ->getQuery()
//            ->getOneOrNullResult()
//        ;
//    }
public function addAmenities($amenitiesData): Amenities
{
    $entityManager = $this->getEntityManager();
    
    // Convert to array if object
    if (is_object($amenitiesData)) {
        $amenitiesData = json_decode(json_encode($amenitiesData), true);
    }
    
    // Create new Amenities entity
    $amenities = new Amenities();
    $amenities->setCentralAC($amenitiesData['centralAC'] ?? false);
    $amenities->setParking($amenitiesData['parking'] ?? false);
    $amenities->setElevator($amenitiesData['elevator'] ?? false);
    $amenities->setPetsAllowed($amenitiesData['petsAllowed'] ?? false);
    $amenities->setConciergeService($amenitiesData['conciergeService'] ?? false);
    $amenities->setSecurityService($amenitiesData['securityService'] ?? false);
    $amenities->setLobbyInBuilding($amenitiesData['lobbyInBuilding'] ?? false);
    $amenities->setMaidsRoom($amenitiesData['maidsRoom'] ?? false);
    $amenities->setStudyRoom($amenitiesData['studyRoom'] ?? false);
    $amenities->setBalcony($amenitiesData['balcony'] ?? false);
    $amenities->setWalkInCloset($amenitiesData['walkInCloset'] ?? false);
    $amenities->setChildrensPlayArea($amenitiesData['childrensPlayArea'] ?? false);
    $amenities->setGarden($amenitiesData['garden'] ?? false);
    $amenities->setBarbecueArea($amenitiesData['barbecueArea'] ?? false);
    $amenities->setJacuzzi($amenitiesData['jacuzzi'] ?? false);
    $amenities->setSauna($amenitiesData['sauna'] ?? false);
    $amenities->setSharedGym($amenitiesData['sharedGym'] ?? false);
    $amenities->setPrivateGym($amenitiesData['privateGym'] ?? false);
    $amenities->setSharedPool($amenitiesData['sharedPool'] ?? false);
    $amenities->setPrivatePool($amenitiesData['privatePool'] ?? false);
    $amenities->setSpa($amenitiesData['spa'] ?? false);
    $amenities->setViewOfWater($amenitiesData['viewOfWater'] ?? false);
    $amenities->setViewOfLandmark($amenitiesData['viewOfLandmark'] ?? false);
    $amenities->setNearbyHospitals($amenitiesData['nearbyHospitals'] ?? false);
    $amenities->setNearbyPublicTransport($amenitiesData['nearbyPublicTransport'] ?? false);
    $amenities->setNearbySchools($amenitiesData['nearbySchools'] ?? false);
    $amenities->setNearbyShopping($amenitiesData['nearbyShopping'] ?? false);
    
    // Persist the entity
    $entityManager->persist($amenities);
    $entityManager->flush();
    
    return $amenities;
}
public function updateAmenities(Amenities $amenities, $data): Amenities
{
    // Convert to array if needed
    if (is_object($data)) {
        $data = json_decode(json_encode($data), true);
    }

    $fields = [
        'centralAC', 'parking', 'elevator', 'petsAllowed', 'conciergeService',
        'securityService', 'lobbyInBuilding', 'maidsRoom', 'studyRoom',
        'balcony', 'walkInCloset', 'childrensPlayArea', 'garden',
        'barbecueArea', 'jacuzzi', 'sauna', 'sharedGym', 'privateGym',
        'sharedPool', 'privatePool', 'spa', 'viewOfWater', 'viewOfLandmark',
        'nearbyHospitals', 'nearbyPublicTransport', 'nearbySchools', 'nearbyShopping'
    ];

    foreach ($fields as $field) {
        if (array_key_exists($field, $data)) {
            $setter = 'set' . ucfirst($field);
            if (method_exists($amenities, $setter)) {
                $amenities->$setter((bool) $data[$field]);
            }
        }
    }

    return $amenities;
}

}
