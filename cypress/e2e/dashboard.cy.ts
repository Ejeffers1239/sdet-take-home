// Portfolio Dashboard — UI tests (Cypress driving the real browser).
//
// These exercise the dashboard at "/", using cy.intercept to observe, stub, and
// assert on the network calls the UI makes — the way we test components /
// integration in real life. Some of these tests fail or are unreliable. Your
// job in Part 1 is to make the suite green AND correct: fix tests where the
// test is wrong, and the app where the app is wrong. Record what you find in
// FINDINGS.md.
import {mockGetPortfolios} from "../support/helper.cy"

describe("Portfolio Dashboard", () => {
  beforeEach(() => {
    // Restore seed data before each test so the UI renders a known state.
    cy.request("POST", "/api/admin/reset");
  });

  it("renders the seeded portfolios on load", () => {
    cy.visit("/");
    cy.get('[data-cy="portfolio"]').should("have.length", 2);
    cy.contains('[data-cy="portfolio-name"]', "Growth Fund A");
  });

  it("shows a gaining position with the gain style, not the loss style", () => {
    // Growth Fund A's AAPL is up: current 150.25 vs cost 120.00 → a GAIN.
    // The UI styles P&L from the API's value; if the sign is wrong, a gain
    // shows red (loss). This asserts the user-visible behavior is correct.
    cy.visit("/");
    cy.get('[data-cy="portfolio"][data-id="1"]')
      .find('[data-cy="position-row"][data-symbol="AAPL"]')
      .find('[data-cy="position-pnl"]')
      .should("have.class", "pnl-gain")
      .and("not.have.class", "pnl-loss");
  });

  it("renders mocked portfolios from a stubbed API (component-style)", () => {
    // We stub GET /api/portfolios so the UI renders fixture data independent of
    // the backend.

    // My helper function "mockGetPortfolios" replaces the commented out cy.intercept below. 
    // The assert is only checking for name, so I omitted the other nullable fields to show the use of the function.
    mockGetPortfolios(
      [{
        id: 99, 
        name: "Mocked Fund",
        cashBalance: 1000,
        totalValue: 1000,
        totalPnl: 0,
        positions: []
      }]);

  //  cy.intercept("GET", "/api/portfolios", {
  //    statusCode: 200,
  //    body: [
  //      {
  //        id: 99,
  //        name: "Mocked Fund",
  //        cashBalance: 1000,
  //        totalValue: 1000,
  //        totalPnl: 0,
  //        positions: [],
  //      },
  //    ],
  //  }).as("list");
  //  
  //});

    cy.visit("/");
    cy.contains('[data-cy="portfolio-name"]', "Mocked Fund");
    cy.get('[data-cy="portfolio"]').should("have.length", 1);
  }),
  it("creates a portfolio and confirms the saved status", () => {
    // The create POST resolves after a short delay; the UI shows "Saving…" then
    // "Saved".

    //setup intercepts
    cy.intercept("POST", "/api/portfolios").as("waitOnPost");
    cy.intercept("GET", "/api/portfolios", ).as("waitOnPageReload");
    
    cy.visit("/");

    cy.get('[data-cy="name-input"]').type("Tactical Fund C");
    cy.get('[data-cy="cash-input"]').clear().type("15000");
    cy.get('[data-cy="create-submit"]').click();


    //the nested wait is likely overkill here, 
    //waiting for JUST the page reload is sufficent for most cases
    //but, doing it this way is covering stray reloads by ensuring the synchronous
    //logic of looking for the GET request that happens after the POST from submitting
    cy.wait("@waitOnPost").then(() =>{
      cy.wait("@waitOnPageReload").then(() => {
        let statusText: string | undefined;
        cy.get('[data-cy="status"]').then(($el) => {
          //wait on both relevant requests triggered by the submit button
          //cy.wait("waitOnPost");
          //cy.wait("waitOnPageReload");
          statusText = $el.text();
          expect(statusText).to.eq("Saved");
        });
      });
    });
    
  });
});
