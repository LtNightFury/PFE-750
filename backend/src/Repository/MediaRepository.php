<?php

namespace App\Repository;

use App\Entity\Media;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;
use App\Entity\Photos;
use App\Entity\FloorPlans;
use App\Entity\Documents;
/**
 * @extends ServiceEntityRepository<Media>
 *
 * @method Media|null find($id, $lockMode = null, $lockVersion = null)
 * @method Media|null findOneBy(array $criteria, array $orderBy = null)
 * @method Media[]    findAll()
 * @method Media[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class MediaRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Media::class);
    }

//    /**
//     * @return Media[] Returns an array of Media objects
//     */
//    public function findByExampleField($value): array
//    {
//        return $this->createQueryBuilder('m')
//            ->andWhere('m.exampleField = :val')
//            ->setParameter('val', $value)
//            ->orderBy('m.id', 'ASC')
//            ->setMaxResults(10)
//            ->getQuery()
//            ->getResult()
//        ;
//    }

//    public function findOneBySomeField($value): ?Media
//    {
//        return $this->createQueryBuilder('m')
//            ->andWhere('m.exampleField = :val')
//            ->setParameter('val', $value)
//            ->getQuery()
//            ->getOneOrNullResult()
//        ;
//    }
    // In MediaRepository
        public function createMediaWithPhotos(array $mediaFiles): Media
    {
        $entityManager = $this->getEntityManager();

        $media = new Media();
        $entityManager->persist($media);

        if (!empty($mediaFiles['photos'])) {
            foreach ($mediaFiles['photos'] as $photoFile) {
                $photo = new Photos();
                $photo->setImageFile($photoFile);
                $photo->setMedia($media);
                $media->addPhoto($photo); // Make sure this method exists in Media entity
                $entityManager->persist($photo);
            }
        }

        if (!empty($mediaFiles['floorPlans'])) {
            foreach ($mediaFiles['floorPlans'] as $floorplanFile) {
                $floorplans = new FloorPlans(); // Make sure the class name is correct
                $floorplans->setImageFile($floorplanFile);
                $floorplans->setMedia($media);
                $media->addFloorPlan($floorplans); // Make sure this method exists in Media entity
                $entityManager->persist($floorplans);
            }
        }
        if (!empty($mediaFiles['documents'])) {
            foreach ($mediaFiles['documents'] as $documentfile) {
                $document = new Documents(); // Make sure the class name is correct
                $document->setImageFile($documentfile);
                $document->setMedia($media);
                $media->addDocument($document); // Make sure this method exists in Media entity
                $entityManager->persist($document);
            }
        }

        return $media;
    }

}
