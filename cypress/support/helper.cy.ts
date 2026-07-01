

//I would love to give these fields defaults but from what I can tell
//that's not possible with JS interfaces.
//i'd have to do something along the lines of serializing a dynamic size array of mockBody classes.
//which seems hacky.
interface mockBody {
    id: number;
    name: string;
    cashBalance: number;
    totalValue: number;
    totalPnl: number;
    positions:position[];
}

interface position{
    symbol: string;
    quantity?: number;
    costBasis?: number;
    currentPrice?: number;
    marketValue?: number;
    pnl?: number;
}


/**
 * mockGetPortfolios registers a cy.intercept for GET /api/portfolios 
 * with flexible input body data: the only required fields are id and name.
 * any declarations beyond the first will OVERWRITE previous mocks, consistent with cy.intercept.
 * @argument bodyArr: an array of mockBody json objects as described above. minimum example is [{id:1}]
 */
export function mockGetPortfolios(bodyArr: mockBody[]): Cypress.Chainable<null> {
    return cy.intercept("GET", "/api/portfolios", {
      statusCode: 200,
      body: bodyArr,
    });
}