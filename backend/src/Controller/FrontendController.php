<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class FrontendController extends AbstractController
{
    #[Route(
        '/{path}',
        name: 'frontend',
        requirements: [
            'path' => '^(?!api|_wdt|_profiler|media|uploads|bundles|favicon\.ico|robots\.txt|.*\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|map)$).+'
        ],
        defaults: ['path' => null]
    )]
    public function index(): Response
    {
        $indexFile = $this->getParameter('kernel.project_dir') . '/public/index.html';

        if (!file_exists($indexFile)) {
            return new Response("index.html not found", 500);
        }

        return new Response(file_get_contents($indexFile), 200, [
            'Content-Type' => 'text/html',
        ]);
    }
}
