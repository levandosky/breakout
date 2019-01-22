import React from "react";
import ReactDOM from "react-dom";
import Bricks from "./Bricks";
import Enzyme, { mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
Enzyme.configure({ adapter: new Adapter() });

it("renders without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(<Bricks bricks={[{ durability: 1 }]} />, div);
  ReactDOM.unmountComponentAtNode(div);
});

it("renders two bricks", () => {
  debugger;
  const wrapper = mount(
    <Bricks bricks={[{ durability: 1 }, { durability: 1 }]} />
  );
  expect(wrapper.children()).toHaveLength(2);
});
