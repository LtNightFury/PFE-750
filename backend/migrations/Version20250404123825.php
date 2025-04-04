<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250404123825 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql(<<<'SQL'
            ALTER TABLE property ADD title VARCHAR(255) NOT NULL, ADD type VARCHAR(255) NOT NULL, ADD description LONGTEXT NOT NULL, ADD price DOUBLE PRECISION NOT NULL, ADD size VARCHAR(50) NOT NULL, ADD status VARCHAR(20) NOT NULL, ADD latitude DOUBLE PRECISION NOT NULL, ADD longitude DOUBLE PRECISION NOT NULL, ADD year_built INT NOT NULL, ADD is_available_date DATETIME DEFAULT NULL, ADD photos JSON NOT NULL, ADD nbre_rooms INT NOT NULL, ADD nbre_bath INT NOT NULL, ADD nbreof_parking INT NOT NULL, ADD amenities JSON NOT NULL, ADD video_tour VARCHAR(255) DEFAULT NULL
        SQL);
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql(<<<'SQL'
            ALTER TABLE property DROP title, DROP type, DROP description, DROP price, DROP size, DROP status, DROP latitude, DROP longitude, DROP year_built, DROP is_available_date, DROP photos, DROP nbre_rooms, DROP nbre_bath, DROP nbreof_parking, DROP amenities, DROP video_tour
        SQL);
    }
}
