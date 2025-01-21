<?php

namespace App\Provider;

use Symfony\Contracts\HttpClient\HttpClientInterface;
use Symfony\Component\DomCrawler\Crawler;
use Psr\Log\LoggerInterface;
use App\Entity\Ticket;

class VividSeatsProvider implements TicketProviderInterface
{
    private HttpClientInterface $client;
    private LoggerInterface $logger;

    public function __construct(HttpClientInterface $client, LoggerInterface $logger)
    {
        $this->client = $client;
        $this->logger = $logger;
    }

    public function getAvailableTickets(string $url): array
    {
        $this->logger->info('Fetching URL: ' . $url);

        try {
            $response = $this->client->request('GET', $url, [
                'headers' => [
                    'User-Agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:91.0) Gecko/20100101 Firefox/91.0',
                    'Accept' => 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                    'Accept-Language' => 'en-US,en;q=0.5',
                    'Connection' => 'keep-alive',
                    'Upgrade-Insecure-Requests' => '1',
                ]
            ]);

            if ($response->getStatusCode() !== 200) {
                $this->logger->error('Error fetching the URL. Status code: ' . $response->getStatusCode());
                return [];
            }

            $content = $response->getContent();
            $this->logger->info('Content received. Length: ' . strlen($content));

            $crawler = new Crawler($content);

            // Ajustamos el selector basado en la estructura proporcionada
            $ticketRows = $crawler->filter('div[data-testid="listing-row-container"]');

            if ($ticketRows->count() === 0) {
                $this->logger->warning('No ticket rows found in the page. Verifica si el selector CSS es correcto.');
                return [];
            }

            $tickets = [];
            $this->logger->info('Parsing ' . $ticketRows->count() . ' tickets...');

            $ticketRows->each(function (Crawler $node) use (&$tickets) {
                // Ajustamos los selectores según la nueva estructura
                $sectorNode = $node->filter('div[data-testid="CATEGORY 3"], div[data-testid="CATEGORIA 3"]');
                $sector = $sectorNode->count() > 0 ? trim($sectorNode->text('N/A')) : 'N/A';
                $this->logger->info('Sector found: ' . $sector);

                $rowNode = $node->filter('span[data-testid="row"]');
                $row = $rowNode->count() > 0 ? trim($rowNode->text('N/A')) : 'N/A';
                $this->logger->info('Row found: ' . $row);

                $priceNode = $node->filter('span[data-testid="listing-price"]');
                $price = $priceNode->count() > 0 ? floatval(str_replace(['$', ','], '', $priceNode->text(''))) : 0.0;
                $this->logger->info('Price found: ' . $price);

                $tickets[] = new Ticket($sector, $row, $price);
            });

            $this->logger->info('Total tickets found: ' . count($tickets));

            return $tickets;
        } catch (\Exception $e) {
            $this->logger->error('Error fetching tickets: ' . $e->getMessage());
            return [];
        }
    }
}
