<?php

namespace App\Repository;

use App\Entity\Location;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Location>
 *
 * @method Location|null find($id, $lockMode = null, $lockVersion = null)
 * @method Location|null findOneBy(array $criteria, array $orderBy = null)
 * @method Location[]    findAll()
 * @method Location[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class LocationRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        
        parent::__construct($registry, Location::class);
    }

//    /**
//     * @return Location[] Returns an array of Location objects
//     */
//    public function findByExampleField($value): array
//    {
//        return $this->createQueryBuilder('l')
//            ->andWhere('l.exampleField = :val')
//            ->setParameter('val', $value)
//            ->orderBy('l.id', 'ASC')
//            ->setMaxResults(10)
//            ->getQuery()
//            ->getResult()
//        ;
//    }

//    public function findOneBySomeField($value): ?Location
//    {
//        return $this->createQueryBuilder('l')
//            ->andWhere('l.exampleField = :val')
//            ->setParameter('val', $value)
//            ->getQuery()
//            ->getOneOrNullResult()
//        ;
//    }
    public function addLocation($locationData): Location
    {
        $entityManager = $this->getEntityManager();
        
        // Convert to array if object
        if (is_object($locationData)) {
            $locationData = json_decode(json_encode($locationData), true);
        }
        
        // Create new Location entity
        $location = new Location();
        $location->setLatitude($locationData['latitude']);
        $location->setLongitude($locationData['longitude']);
        $location->setCity($locationData['city']);
        $location->setCountry($locationData['country']);
        $location->setSubcity($locationData['subcity']);
        
        // optionally persist with entity manager
        $entityManager->persist($location);
        $entityManager->flush();

        return $location;
    }
}
