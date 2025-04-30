<?php

namespace App\Repository;

use App\Entity\Price;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Price>
 *
 * @method Price|null find($id, $lockMode = null, $lockVersion = null)
 * @method Price|null findOneBy(array $criteria, array $orderBy = null)
 * @method Price[]    findAll()
 * @method Price[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class PriceRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Price::class);
    }

//    /**
//     * @return Price[] Returns an array of Price objects
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

//    public function findOneBySomeField($value): ?Price
//    {
//        return $this->createQueryBuilder('p')
//            ->andWhere('p.exampleField = :val')
//            ->setParameter('val', $value)
//            ->getQuery()
//            ->getOneOrNullResult()
//        ;
//    }
    public function addPrice($priceData): Price
    {
        $entityManager = $this->getEntityManager();
        
        // Convert to array if object
        if (is_object($priceData)) {
            $priceData = json_decode(json_encode($priceData), true);
        }
        
        // Create new Price entity
        $price = new Price();
        $price->setPrice($priceData['price']);
        $price->setPricesqft($priceData['pricesqft']);
        $price->setOriginalprice($priceData['originalprice']);
        $price->setHideprice($priceData['hideprice']);
        $price->setCharges($priceData['charges']);
        $price->setPriceunit($priceData['priceunit']);
        $price->setServicecharge($priceData['servicecharge']);



        
        // Persist the entity
        $entityManager->persist($price);
        $entityManager->flush();
        
        return $price;
    }
    public function updatePrice(Price $priceEntity, $priceData): Price
{
    // Convert to array if object
    if (is_object($priceData)) {
        $priceData = json_decode(json_encode($priceData), true);
    }

    if (isset($priceData['price'])) {
        $priceEntity->setPrice((string) $priceData['price']);
    }

    if (isset($priceData['pricesqft'])) {
        $priceEntity->setPricesqft($priceData['pricesqft'] !== null ? (string) $priceData['pricesqft'] : null);
    }

    if (isset($priceData['originalprice'])) {
        $priceEntity->setOriginalprice($priceData['originalprice'] !== null ? (string) $priceData['originalprice'] : null);
    }

    if (isset($priceData['hideprice'])) {
        $priceEntity->setHideprice((bool) $priceData['hideprice']);
    }

    if (isset($priceData['charges'])) {
        $priceEntity->setCharges($priceData['charges']);
    }

    if (isset($priceData['servicecharge'])) {
        $priceEntity->setServicecharge($priceData['servicecharge'] !== null ? (string) $priceData['servicecharge'] : null);
    }

    return $priceEntity;
}

}
