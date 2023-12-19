/**
 * @jest-environment jsdom
 */
import  '@testing-library/dom'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'

import {screen, waitFor} from "@testing-library/dom"
import BillsUI from "../views/BillsUI.js"
import { bills } from "../fixtures/bills.js"
import { ROUTES, ROUTES_PATH} from "../constants/routes.js";
import {localStorageMock} from "../__mocks__/localStorage.js";
import Bills from "../containers/Bills.js"

import router from "../app/Router.js";

describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", async () => {

      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.Bills)
      await waitFor(() => screen.getByTestId('icon-window'))
      const windowIcon = screen.getByTestId('icon-window')
      expect(windowIcon).toHaveClass('active-icon')
    })
    test("Then bills should be ordered from earliest to latest", () => {
      document.body.innerHTML = BillsUI({ data: bills })
      const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
      const antiChrono = (a, b) => ((a < b) ? 1 : -1)
      const datesSorted = [...dates].sort(antiChrono)
      expect(dates).toEqual(datesSorted)
    })

  })

  //Unit tests added

  describe("When I am on Bills Page", () => {
    test("A form is present on the web page", () => {
      Object.defineProperty(window, "localStorage", { value: localStorageMock });
    window.localStorage.setItem(
      "user",
      JSON.stringify({
        type: "Employee",
      })
    );
    const root = document.createElement("div");
    root.setAttribute("id", "root");
    document.body.append(root);
    router();
    window.onNavigate(ROUTES_PATH.Bills)
    const billsTable = screen.getByTestId('tbody')
    expect(billsTable).toBeTruthy()
    })
  })

  describe("When I am on Bills Page and click on the New Expense Claim button.", () => {
    test("The application redirects me to the NewBill page ", () => {
      Object.defineProperty(window, "localStorage", { value: localStorageMock });
    window.localStorage.setItem(
      "user",
      JSON.stringify({
        type: "Employee",
      })
    );
    const root = document.createElement("div");
    root.setAttribute("id", "root");
    document.body.append(root);
    router();
    window.onNavigate(ROUTES_PATH.Bills)

      const newBillBtn = screen.getByTestId("btn-new-bill");
      
      userEvent.click(newBillBtn);

      const expenseClaim = screen.getByText("Envoyer une note de frais")
      const formNewBill = screen.getByTestId("form-new-bill")

      expect(expenseClaim).toBeTruthy()
      expect(formNewBill).toBeTruthy()
    })
  })

  describe("When I am on Bills Page and I click on the eye icon of an expense claim.", () => {
    test("Modal appears", () => {
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname });
      };

      Object.defineProperty(window, "localStorage", {
        value: localStorageMock,
      });
      window.localStorage.setItem(
        "user",
        JSON.stringify({
          type: "Employee",
        })
      );

      const newBills = new Bills({
        document,
        onNavigate,
        store: null,
        bills: bills,
        localStorage: window.localStorage,
      });
      
        const modale = document.getElementById("modaleFile")
         //mock modale
        $.fn.modal = jest.fn(modale.classList.add("show"));

      document.body.innerHTML = BillsUI({ data: { bills } });

      const iconEye = screen.getAllByTestId("btn-new-bill")[0];
      const handleClickIconEye = jest.fn(
        newBills.handleClickIconEye(iconEye)
      );

      iconEye.addEventListener("click", handleClickIconEye);
      userEvent.click(iconEye);

      expect(handleClickIconEye).toHaveBeenCalled();
      expect(modale).toHaveClass("show")
    })
  })

  

})

