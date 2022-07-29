/**
 * @jest-environment jsdom
 */
import { ROUTES_PATH } from "../constants/routes.js";
import { fireEvent,waitFor,screen } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import {localStorageMock} from "../__mocks__/localStorage.js";
import mockStore from "../__mocks__/store"

import router from "../app/Router.js";
jest.mock("../app/store", () => mockStore)

const testFile = new File(["testdata"], "test.png", { type: "image/png" });


describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {

    Object.defineProperty(window, 'localStorage', { value: localStorageMock })
    window.localStorage.setItem('user', JSON.stringify({
      type: 'Employee'
    }))

    const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.NewBill)

    test("Then the message icon should be highlighted", async () => {

      await waitFor(() => screen.getByTestId('icon-mail'))
      const windowIcon = screen.getByTestId('icon-mail')
      expect(windowIcon.className).toContain("active-icon")

    })

    test("Then I select an attachment and the file should be selected", async () => {
      await waitFor(() => screen.getByTestId('file'))
      const fileInput = screen.getByTestId('file')

      await waitFor(() =>
        fireEvent.change(fileInput, {
          target: { files: [testFile] },
        })
      );

      expect(fileInput.files.length).toBe(1)

    })

    test("Then I select an attachment and the file should be uploaded to server", async () => {
      const spyMock = jest.spyOn(mockStore.bills(), "create")
      await waitFor(() => screen.getByTestId('file'))
      const fileInput = screen.getByTestId('file')
  
  
      await waitFor(() =>
        fireEvent.change(fileInput, {
          target: { files: [testFile] },
        })
      );
  
      expect(spyMock).toHaveBeenCalled();
  
    })

    test("Then the Date Picker input should be filled ", async () => {
  
      await waitFor(() => screen.getByTestId('datepicker'))
      const datePicker = screen.getByTestId('datepicker')
  
      const testValue = '2019-03-09';
      await waitFor(() =>
        fireEvent.change(datePicker, { target: { value: testValue } },
        ));
      expect(datePicker.value).toEqual(testValue);
    })

    test("Then after bill is submited, return to Bills page", async () => {
    
      await waitFor(() => screen.getByTestId('btn-send'))
      const btnSubmit = screen.getByTestId('btn-send')
      const fileInput = screen.getByTestId('file')
  
      await waitFor(()=>{
        fireEvent.change(fileInput, {
          target: { files: [testFile] },
        })
      })
      await waitFor(() =>
        fireEvent.click(btnSubmit),
      );
      expect(window.location.href).toContain("#employee/bills")
  
    })
  
  
  
  
  })


})


