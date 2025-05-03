<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250503123508 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql(<<<'SQL'
            CREATE TABLE property_view (id INT AUTO_INCREMENT NOT NULL, user_id INT DEFAULT NULL, property_id INT DEFAULT NULL, viewed_at DATETIME NOT NULL, INDEX IDX_E1E514B4A76ED395 (user_id), INDEX IDX_E1E514B4549213EC (property_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE property_view ADD CONSTRAINT FK_E1E514B4A76ED395 FOREIGN KEY (user_id) REFERENCES `user` (id)
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE property_view ADD CONSTRAINT FK_E1E514B4549213EC FOREIGN KEY (property_id) REFERENCES property (id)
        SQL);
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql(<<<'SQL'
            ALTER TABLE property_view DROP FOREIGN KEY FK_E1E514B4A76ED395
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE property_view DROP FOREIGN KEY FK_E1E514B4549213EC
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE property_view
        SQL);
    }
}
