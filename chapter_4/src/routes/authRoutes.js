import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../prismaClient.js";

const router = express.Router();

// register a new user
router.post("/register", async (req, res) => {
  const { username, password } = req.body;
  // save username and encrypted password
  //   console.log(username, password);

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }

  //   encrypt the password
  const hashedPassword = bcrypt.hashSync(password, 8);

  //   save new user to database
  try {
    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword
      }
    })

    // add default todo for the new user
    const defaultTodo = `Hello :), Add your first todo`;
    await prisma.todo.create({
      data: {
        task: defaultTodo,
        userId: user.id
      }
    })

    // create token
    const token = jwt.sign(
      { id: result.lastInsertRowid },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );
    res.json({ token });
    res.sendStatus(201);
  } catch (error) {
    console.log(error.message);
    res.send("User already exists");
    res.sendStatus(503);
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        username: username
      }
    })

    if (!user) { return res.status(404).send({ message: "user not found"})}

    const passwordIsValid = bcrypt.compareSync(password, user.password)

    // if the password does not match return out
    if (!passwordIsValid) { return res.status(401).send({ message: "invalid password" })}

    // then we have successfully authenticated the user
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {expiresIn: '24h'})
    res.json({ token })
  } catch (error) {
    console.log(error.message);
    res.sendStatus(503);
  }
});

export default router;
