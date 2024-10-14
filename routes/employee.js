const express = require('express');
const { check,  validationResult } = require('express-validator');
const Employee =  require('../models/Employee');

const router = express.Router();

//Fetch all employees
router.get('/employees', async (req, res) => {
  try {
    const employees =  await Employee.find();
    res.status(200).json(employees);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

 //Create a new employee
router.post('/employees', [
  check('first_name', 'First name is required').not().isEmpty(),
  check ('last_name', 'Last name is required').not().isEmpty(),
  check('email', 'Please include a valid email').isEmail(),
], async (req, res) => {
  const  errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const  { first_name, last_name, email, position, salary, department } = req.body;

  try  {
    const newEmployee = new Employee({
      first_name,
       last_name,
      email,
      position,
      salary,
      department
    });

    const employee = await newEmployee.save();
     res.status(201).json({ message: 'Employee created successfully', employee_id: employee.id });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

//  Get employee by ID
router.get('/employees/:eid', async (req, res) => {
  try {
     const employee = await Employee.findById(req.params.eid);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
     res.status(200).json(employee);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

//  Update employee by ID
router.put('/employees/:eid', [
  check('email', 'Please include a valid email').isEmail(),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
     return res.status(400).json({ errors: errors.array() });
  }

  const { first_name, last_name, email, position, salary, department } = req.body;

  try {
    let employee = await Employee.findById(req.params.eid);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    // Update employee details
    employee.first_name = first_name || employee.first_name;
     employee.last_name = last_name || employee.last_name;
    employee.email = email || employee.email;
    employee.position = position || employee.position;
    employee.salary = salary || employee.salary;
    employee.department = department || employee.department;
    employee.updated_at = Date.now();

    await employee.save();
    res.status(200).json({ message: 'Employee details updated successfully' });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Delete employee by ID
router.delete('/employees', async (req, res) => {
  const employeeId = req.query.eid;
  try {
    let employee = await Employee.findById(employeeId);
    if (!employee) {
       return res.status(404).json({ message: 'Employee not found' });
    }

    await Employee.findByIdAndDelete(employeeId);
      res.status(204).json({ message: 'Employee deleted successfully' });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

 module.exports = router;
