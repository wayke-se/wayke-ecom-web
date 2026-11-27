import theoretically from 'jest-theories';

const fixtures = require('../../test/fixtures');
const fixture = (name: string): any => fixtures.create(name);

import resolve from './message-resolver';

const getRandomMethod = () => fixture('IBankIdCollectRequest').method;

describe('BankId Message Resolver', () => {
  const theories = [
    {
      hintCode: undefined,
      expected: '',
    },
    {
      hintCode: 'outstandingTransaction',
      expected: 'Starta BankID-appen.',
    },
    {
      hintCode: 'noClient',
      expected: 'Starta BankID-appen.',
    },
    {
      hintCode: 'started',
      expected:
        'Söker efter BankID, det kan ta en liten stund... Om det har gått några sekunder och inget BankID har hittats har du sannolikt inget BankID som går att använda för den aktuella identifieringen/underskriften i den här enheten. Om du inte har något BankID kan du hämta ett hos din internetbank.',
    },
    {
      hintCode: 'userSign',
      expected: 'Skriv in din säkerhetskod i BankID-appen och välj Legitimera eller Skriv under.',
    },
    {
      hintCode: 'expiredTransaction',
      expected:
        'BankID-appen svarar inte. Kontrollera att den är startad och att du har internetanslutning. Om du inte har något giltigt BankID kan du hämta ett hos din Bank. Försök sedan igen.',
    },
    {
      hintCode: 'certificateErr',
      expected:
        'Det BankID du försöker använda är för gammalt eller spärrat. Använd ett annat BankID eller hämta ett nytt hos din internetbank.',
    },
    {
      hintCode: 'userCancel',
      expected: 'Åtgärden avbruten.',
    },
    {
      hintCode: 'cancelled',
      expected: 'Åtgärden avbruten. Försök igen.',
    },
    {
      hintCode: 'startFailed',
      expected: 'Starta BankID-appen.',
    },
  ];

  theoretically("Given '{hintCode}', should be '{expected}'", theories, (theory) => {
    const message = resolve(theory.hintCode);
    expect(message).toBe(theory.expected);
  });
});
