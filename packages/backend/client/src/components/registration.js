import React from "react";
import { Paper, Typography, FormControl, TextField, InputLabel, MenuItem, Select, Button, CircularProgress } from "@material-ui/core";
import "../styles/registration.css";
import { Link } from "react-router-dom";
import { API_URL } from "../utilities/helper";

class Registration extends React.Component {
	state = {
		credentials: {
			Name: "",
			EmailAddress: "",
			Password: "",
			staff: {
				StaffNo: "",
				Department: ""
			},
			student: {
				MatNo: "",
				Department: "",
				Level: "",
				CourseOfStudy: ""
			}
		},
		error: false,
		accountType: "student",
		passwordError: false,
		registering: false
	};

	constructor(props) {
		super(props);
	}
	verifyConfirmPassword(event) {
		if (this.state.credentials.Password.trim().length > 0) {
			if (this.state.credentials.Password === event.target.value) {
				this.setState({ ...this.state, passwordError: false });
				return;
			}
			this.setState({ ...this.state, passwordError: true });
			return;
		}
		this.setState({ ...this.state, passwordError: false });
		return;
	}

	renderReg() {
		const isStaff = this.state.accountType === "staff";
		return (
			<form autoComplete="off">
				<FormControl className="inputBox">
					<TextField
						required
						error={this.state.error}
						name="Name"
						fullWidth
						value={this.state.credentials.Name}
						onChange={event => this.handleOnChange(event)}
						label="Fullname"
					/>
				</FormControl>
				<FormControl className="inputBox emailInput">
					<TextField
						required
						error={this.state.error}
						type="email"
						name="Email"
						value={this.state.credentials.EmailAddress}
						fullWidth
						onChange={event => this.handleOnChange(event)}
						label="Email"
					/>
				</FormControl>
				<FormControl className="inputBox">
					<TextField
						required
						error={this.state.error}
						type="password"
						name="Password"
						value={this.state.credentials.Password}
						fullWidth
						onChange={event => this.handleOnChange(event)}
						label="Password"
					/>
				</FormControl>
				<FormControl className="inputBox">
					<TextField
						required
						error={this.state.passwordError}
						type="confirm password"
						name="ConfirmPassword"
						fullWidth
						onChange={event => this.verifyConfirmPassword(event)}
						label="Confirm Password"
					/>
				</FormControl>
				<br />
				<FormControl className="selectType">
					<InputLabel>Account Type</InputLabel>
					<Select error={this.state.error} onChange={event => this.handleSelectChange(event)} value={this.state.accountType}>
						<MenuItem value="student">Student</MenuItem>
						<MenuItem value="staff">Staff</MenuItem>
					</Select>
				</FormControl>
				<div className="remDetails">
					{isStaff ? this.renderStaffReg() : this.renderStudentReg()}
					<br />
					<Button
						className="regButton"
						disabled={this.state.registering}
						onClick={() => this.handleRegistration()}
						variant="contained"
						size="large"
					>
						{this.state.registering ? <CircularProgress color="primary" /> : "Register"}
					</Button>
					<p
						style={{
							marginTop: "15px",
							fontSize: "15px",
							cursor: "pointer"
						}}
					>
						{" "}
						Already have an account? <Link to="/">Login</Link>
					</p>
				</div>
			</form>
		);
	}

	handleRegistration() {
		if (!this.state.registering) {
			this.setState({ registering: true });
			let newAccount = { ...this.state.credentials };

			const isStudentDetailsEmpty =
				newAccount.student.MatNo.trim() === "" ||
				newAccount.student.CourseOfStudy.trim() === "" ||
				newAccount.student.Department.trim() === "" ||
				newAccount.student.Level.trim() === "";
			const isStaffDetailsEmpty = newAccount.staff.StaffNo.trim() === "" || newAccount.staff.Department.trim() === "";
			const isDetailsEmpty = newAccount.Name.trim() === "" || newAccount.Password.trim() === "" || newAccount.EmailAddress.trim() === "";

			const postReg = details => {
				fetch(`${API_URL}/api/auth/register?type=${this.state.accountType}`, {
					method: "POST",
					body: JSON.stringify(details),
					headers: new Headers({
						"Content-Type": "application/json"
					})
				})
					.then(res => {
						alert("Registration Successfull!!");
						this.setState({ registering: false });
						this.props.history.push("/");
					})
					.catch(err => {
						this.setState({ error: true, registering: false });
						alert("an error ocurred!");
					});
			};

			//Check for the type of account being registered
			if (this.state.accountType === "student") {
				//Sanity checks
				if (isDetailsEmpty || isStudentDetailsEmpty) {
					this.setState({
						registering: false,
						error: true,
						passwordError: true
					});
					alert("Please provide details!!");
					return;
				}
				//Remove the staff object as it is not needed in this context
				delete newAccount.staff;
				/* Create a new student object with all properties in one object */
				const studentDetails = newAccount.student;
				delete newAccount.student;

				const objTosend = { ...newAccount, ...studentDetails };

				postReg(objTosend);
			} else {
				if (isDetailsEmpty || isStaffDetailsEmpty) {
					this.setState({
						registering: false,
						error: true,
						passwordError: true
					});
					alert("Please provide details!!");
					return;
				}
				//Remove the student object as it is not needed in this context
				delete newAccount.student;
				/* Create a new staff object with all properties in one object */
				const staffDetails = newAccount.staff;
				delete newAccount.staff;

				const objTosend = { ...newAccount, ...staffDetails };

				postReg(objTosend);
			}

			return;
		}
	}

	handleOnChange($event) {
		const newState = { ...this.state };
		const { name, value } = $event.target;

		if (newState.error) {
			newState.error = false;
			newState.passwordError = false;
		}

		if (name === "Name") {
			newState.credentials.Name = value.trim();
		} else if (name === "Password") {
			newState.credentials.Password = value.trim();
		} else if (name === "Email") {
			newState.credentials.EmailAddress = value.trim();
		}

		if (this.state.accountType === "student") {
			if (name === "MatNo") {
				newState.credentials.student.MatNo = value.trim();
			} else if (name === "CourseOfStudy") {
				newState.credentials.student.CourseOfStudy = value.trim();
			}
		} else {
			if (name === "StaffNo") {
				newState.credentials.staff.StaffNo = value.trim();
			}
		}

		this.setState(newState);
	}

	handleSelectChange(event) {
		if (event.target.value === "student") this.setState({ ...this.state, accountType: "student" });
		else if (event.target.value === "staff") this.setState({ ...this.state, accountType: "staff" });
	}

	handleDeptSelect(event) {
		const obj = { ...this.state };
		if (this.state.accountType === "student") {
			obj.credentials.student.Department = event.target.value;
		} else {
			obj.credentials.staff.Department = event.target.value;
		}

		this.setState(obj);
	}

	renderStudentReg() {
		return (
			<React.Fragment>
				<FormControl className="selectType2">
					<InputLabel>Department</InputLabel>
					<Select
						onChange={event => this.handleDeptSelect(event)}
						error={this.state.error}
						value={
							this.state.accountType === "student" ? this.state.credentials.student.Department : this.state.credentials.staff.Department
						}
					>
						<MenuItem value="mathematics">Mathematics</MenuItem>
						<MenuItem value="microbiology">Microbiology</MenuItem>
						<MenuItem value="economics">Economics</MenuItem>
						<MenuItem value="accounting">Accounting</MenuItem>
						<MenuItem value="philosophy">Philosophy</MenuItem>
						<MenuItem value="english & literature">English and Literature</MenuItem>
					</Select>
				</FormControl>
				<FormControl className="marginFix" style={{ width: "150px" }}>
					<TextField
						required
						error={this.state.error}
						name="MatNo"
						fullWidth
						value={this.state.credentials.student.MatNo}
						onChange={event => this.handleOnChange(event)}
						label="Matric Number"
					/>
				</FormControl>
				<br />
				<div style={{ marginTop: "10px" }}>
					<FormControl className="selectType2">
						<InputLabel>Level</InputLabel>
						<Select
							onChange={event => {
								const obj = { ...this.state };
								obj.credentials.student.Level = event.target.value;
								this.setState(obj);
							}}
							error={this.state.error}
							value={this.state.credentials.student.Level}
						>
							<MenuItem value="100">100 level</MenuItem>
							<MenuItem value="200">200 level</MenuItem>
							<MenuItem value="300">300 level</MenuItem>
							<MenuItem value="400">400 level</MenuItem>
						</Select>
					</FormControl>
					<FormControl className="marginFix" style={{ width: "250px" }}>
						<TextField
							required
							error={this.state.error}
							name="CourseOfStudy"
							fullWidth
							value={this.state.credentials.student.CourseOfStudy}
							onChange={event => this.handleOnChange(event)}
							label="Course of study"
						/>
					</FormControl>
				</div>
			</React.Fragment>
		);
	}

	renderStaffReg() {
		return (
			<React.Fragment>
				<FormControl className="selectType2">
					<InputLabel>Department</InputLabel>
					<Select
						onChange={event => this.handleDeptSelect(event)}
						error={this.state.error}
						value={
							this.state.accountType === "student" ? this.state.credentials.student.Department : this.state.credentials.staff.Department
						}
					>
						<MenuItem value="mathematics">Mathematics</MenuItem>
						<MenuItem value="microbiology">Microbiology</MenuItem>
						<MenuItem value="economics">Economics</MenuItem>
						<MenuItem value="accounting">Accounting</MenuItem>
						<MenuItem value="philosophy">Philosophy</MenuItem>
						<MenuItem value="english & literature">English and Literature</MenuItem>
					</Select>
				</FormControl>
				<FormControl style={{ marginLeft: "5px", width: "120px" }}>
					<TextField
						required
						error={this.state.error}
						name="StaffNo"
						fullWidth
						value={this.state.credentials.staff.StaffNo}
						onChange={event => this.handleOnChange(event)}
						label="Staff Number"
					/>
				</FormControl>
			</React.Fragment>
		);
	}

	render() {
		return (
			<Paper className="regContainer" elevation={5}>
				<Typography style={{ alignSelf: "center" }} variant="h4">
					Registration
				</Typography>
				<div className="regContainer2">{this.renderReg()}</div>
			</Paper>
		);
	}
}

export default Registration;
