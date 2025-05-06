import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Nav from "react-bootstrap/Nav";
import Link from "next/link";
import "./topbar.scss";

function TopBar() {
  return (
    <Navbar className="top-bar" expand="md">
      <Container fluid className="inner-container">
        <Navbar.Brand className="brand">Currency Web</Navbar.Brand>
        <Nav className="ms-auto">
          <Button as={Link} href="/sign-in" className="login-btn">
            Login
          </Button>
        </Nav>
      </Container>
    </Navbar>
  );
}

export default TopBar;
