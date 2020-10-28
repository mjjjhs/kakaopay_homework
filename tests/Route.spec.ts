import {CheckedOtherThanRouteHash, CheckedRouteHash} from "../src/helpers";

test('CheckedOtherThanRouteHash Test', () => {
  expect(CheckedOtherThanRouteHash('start')).toBeTruthy();
});
test('CheckedRouteHash Test', () => {
  expect(CheckedRouteHash('start')).toBeFalsy();
});
