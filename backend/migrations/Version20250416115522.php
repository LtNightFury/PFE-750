<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250416115522 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql(<<<'SQL'
            ALTER TABLE documents DROP FOREIGN KEY FK_A2B07288EA9FDD75
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE documents CHANGE media_id media_id INT NOT NULL
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE documents ADD CONSTRAINT FK_A2B07288EA9FDD75 FOREIGN KEY (media_id) REFERENCES media (id) ON DELETE CASCADE
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE floor_plans DROP FOREIGN KEY FK_E746E1E7EA9FDD75
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE floor_plans CHANGE media_id media_id INT NOT NULL
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE floor_plans ADD CONSTRAINT FK_E746E1E7EA9FDD75 FOREIGN KEY (media_id) REFERENCES media (id) ON DELETE CASCADE
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE photos DROP FOREIGN KEY FK_876E0D9EA9FDD75
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE photos ADD CONSTRAINT FK_876E0D9EA9FDD75 FOREIGN KEY (media_id) REFERENCES media (id) ON DELETE CASCADE
        SQL);
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql(<<<'SQL'
            ALTER TABLE photos DROP FOREIGN KEY FK_876E0D9EA9FDD75
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE photos ADD CONSTRAINT FK_876E0D9EA9FDD75 FOREIGN KEY (media_id) REFERENCES media (id)
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE floor_plans DROP FOREIGN KEY FK_E746E1E7EA9FDD75
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE floor_plans CHANGE media_id media_id INT DEFAULT NULL
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE floor_plans ADD CONSTRAINT FK_E746E1E7EA9FDD75 FOREIGN KEY (media_id) REFERENCES media (id)
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE documents DROP FOREIGN KEY FK_A2B07288EA9FDD75
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE documents CHANGE media_id media_id INT DEFAULT NULL
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE documents ADD CONSTRAINT FK_A2B07288EA9FDD75 FOREIGN KEY (media_id) REFERENCES media (id)
        SQL);
    }
}
