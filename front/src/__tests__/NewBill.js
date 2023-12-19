/**
 * @jest-environment jsdom
 */
import {
  getByRole,
  getByLabelText,
  getByAltText,
  getByTestId,
  fireEvent,
  waitFor
} from '@testing-library/dom'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'


import { screen } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill, {handleSubmit, handleChangeFile} from "../containers/NewBill.js"
import { bills } from "../fixtures/bills.js"

import {localStorageMock} from "../__mocks__/localStorage.js";

import router from "../app/Router.js";

//import { bills } from "../fixtures/bills.js"
import { ROUTES_PATH} from "../constants/routes.js";

import mockStore from "../__mocks__/store.js";

const bill = {
  email: "employee@test.tld",
  type: "Hôtel et logement",
  name: "Hôtel du centre ville",
  amount: 120,
  date: "2022-12-30",
  vat: "10",
  pct: 10,
  commentary: "",
  fileUrl: "testFacture.png",
  fileName: "testFacture",
  status: 'pending'
};


describe("Given I am connected as an employee", () => {
  /*beforeEach(() => {
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
  })*/

  describe("When I am on NewBill Page", () => {
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
      window.onNavigate(ROUTES_PATH.NewBill)
      const formNewBill = screen.getByTestId('form-new-bill')
      expect(formNewBill).toBeTruthy()
    })
  })

  describe("When I am on NewBill Page", () => {
    test("Then mail icon in vertical layout should be highlighted", () => {
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
      window.onNavigate(ROUTES_PATH.NewBill)
      const mailIcon = screen.getByTestId('icon-mail')
      expect(mailIcon).toHaveClass('active-icon')
    })
  })
describe("When I am on NewBill Page and I download a file with the wrong extension", () => {
    test("The file is not downloaded and an error message appears", () => {
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
    const newBill = new NewBill({
      document,
      onNavigate,
      store: mockStore,
      localStorage: localStorageMock,
    });

    const handleChangeFile = jest.fn(newBill.handleChangeFile);
    const inputFile = screen.getByTestId("file");
    inputFile.addEventListener("change", handleChangeFile);
    fireEvent.change(inputFile, {
      target: {
        files: [
          new File(["document"], "document.png", {
            type: "image/png",
          }),
        ],
      },
    })
    console.log(inputFile.files[0].name)
    expect(handleChangeFile).toHaveBeenCalled();
    expect(handleChangeFile).toBeCalled();
    expect(screen.getByText("Envoyer une note de frais")).toBeTruthy();
    const msgErrorExt = screen.getByTestId('msg-error-ext')
    expect(msgErrorExt).toBeTruthy();

    })
  })

  //Champ requis vide
  describe("When I am on NewBill Page and empty form and i click form submit button", () => {
    test("The form should not be sent and we stay on the newbills page", () => {
      const newBill = new NewBill({
        document,
        onNavigate,
        store: mockStore,
        localStorage: window.localStorage,
      })
        const handleSubmit = jest.fn(newBill.handleSubmit);

      const form = screen.getByTestId("form-new-bill");
      form.addEventListener("submit", handleSubmit);
      fireEvent.submit(form);
      expect(handleSubmit).toHaveBeenCalled();
    })
  })

})
