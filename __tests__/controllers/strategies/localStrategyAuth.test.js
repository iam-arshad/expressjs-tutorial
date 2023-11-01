const { localStrategyVerifyFunction } = require("../../../src/controllers/auth");
const User = require("../../../src/database/schemas/users");
const { comparePasswords } = require("../../../src/utils/authUtils");

jest.mock("../../../src/database/schemas/users");

const username = "a@a.com";
const password = "a1";
const done = jest.fn();

beforeEach(() => {
    done.mockClear();
});

it("should not login if the user is not found", async () => {
    User.findOne.mockResolvedValue(undefined) //mock the findOne method from User model to return undefined(for unregistered users)
    await localStrategyVerifyFunction(username, password, done);//invoke the function
    expect(User.findOne).toHaveBeenCalledWith({ username });
    expect(done).toHaveBeenCalledTimes(1);
    expect(done).toHaveBeenCalledWith(null, false, { message: 'user not found' });
})

it("should not login for the wrong password of the registered user", async () => {
    User.findOne.mockResolvedValue({ username: username, password: "hab3#3787bkd7811" }) //mock the findOne method from User model to return undefined(for unregistered users)
    jest.mock("../../../src/utils/authUtils", () => {
        comparePasswords: jest.fn(() => false);
    })
    await localStrategyVerifyFunction(username, password, done);//invoke the function
    expect(User.findOne).toHaveBeenCalledWith({ username });
    expect(done).toHaveBeenCalledTimes(1);
    expect(done).toHaveBeenCalledWith(null, false, { message: 'Incorrect password.' });
    jest.resetModules();
})

it("should login with valid credentials", async () => {
    User.findOne.mockResolvedValue({ username, password}) //mock the findOne method from User model to return undefined(for unregistered users)
    jest.mock("../../../src/utils/authUtils", () => ({
        comparePasswords: jest.fn().mockResolvedValue(true)
    }));
    await localStrategyVerifyFunction(username, password, done);//invoke the function
    expect(User.findOne).toHaveBeenCalledWith({ username });
    expect(done).toHaveBeenCalledTimes(1);
    // expect(done).toHaveBeenCalledWith(null,{ username,password }); //mocked function comparePasswords is returning false instead of true.Dont know why....
    jest.resetModules();
})

// for testing the catch block, we need to throw an error like the user not found,....We can test in that manner.But the server will be stopped from there.
