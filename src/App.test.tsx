import React from "react";
import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import App from "./pages/GoogleMap";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => jest.fn(),
}));

test("render page normally", () => {
  const { getByText } = render(
    <Provider store={store}>
      <App />
    </Provider>
  );

  expect(getByText(/History Result/i)).toBeInTheDocument();
});

describe("process.env", () => {
  const env = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...env };
  });

  afterEach(() => {
    process.env = env;
  });
  test("can't render page when google api not exist", () => {
    process.env.REACT_APP_GOOGLE_API = undefined;

    const { getByText } = render(
      <Provider store={store}>
        <App />
      </Provider>
    );

    expect(
      getByText(/Please provide Google Api to make Google Map works/i)
    ).toBeInTheDocument();
  });
});
