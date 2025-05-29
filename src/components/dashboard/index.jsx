"use client";
import React, { useEffect, useState, startTransition } from "react";
import { useActionState } from "react";
import {
  getDashboardData,
  handleDeleteSelectedAccount,
  handleLogOutAPI,
} from "@/actions/dashboard-action";
import { initialResponse } from "@/helpers/formValidation";
import { signOut } from "next-auth/react";
import { swalConfirm, swalToast } from "@/helpers/swal";
import DepositHistoryModal from "../deposit-history";
import WithdrawHistoryModal from "../withdraw-history";
import ExchangeModal from "../exchange";
import MyCardsModal from "../my-cards";
import AddAccountModal from "../add-account";
import EditProfileModal from "../edit-profile";
import ExchangeHistoryModal from "../exchange-history";
import DepositModal from "../deposit";
import WithdrawModal from "../withdraw";
import { Row, Col, Card, Button, Dropdown } from "react-bootstrap";
import Image from "next/image";
import "./style.scss";

const Dashboard = ({ session }) => {
  const [state, dispatch] = useActionState(getDashboardData, initialResponse);
  const [accounts, setAccounts] = useState([]);
  const [showExchangeHistoryModal, setShowExchangeHistoryModal] = useState(false);
  const [showExchangeModal, setShowExchangeModal] = useState(false);
  const [showMyCardsAccountModal, setShowMyCardsAccountModal] = useState(false);
  const [showAddAccountModal, setShowAddAccountModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showDepositHistoryModal, setShowDepositHistoryModal] = useState(false);
  const [showWithdrawHistoryModal, setShowWithdrawHistoryModal] = useState(false);
  const [visibleAccounts, setVisibleAccounts] = useState({});
  const [selectedCurrencyCode, setSelectedCurrencyCode] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const formData = new FormData();
    formData.append("userId", session?.user?.id);
    formData.append("token", session?.accessToken);
    startTransition(() => {
      dispatch(formData);
    });
  }, [session, dispatch, reloadKey]);

  useEffect(() => {
    let updatedAccounts = Array.isArray(state?.data) ? [...state.data] : [];
  
    const hasPLN = updatedAccounts.some((acc) => acc.currency_code === "PLN");
  
    if (!hasPLN) {
      updatedAccounts.unshift({
        account_id: "PLN_PLACEHOLDER",
        account_number: "XXX-XXX-XXXX",
        currency_code: "PLN",
        balance: "0.00",
        isPlaceholder: true,
      });
    }
  
    setAccounts(updatedAccounts);
  }, [state]);
  

  const handleLogout = async () => {
    const resp = await swalConfirm("Are you sure to logout?");
    if (!resp.isConfirmed) return;

    const result = await handleLogOutAPI(session?.accessToken, session?.refreshToken);
    if (result.error) {
      swalToast(result.error);
    } else {
      swalToast("You have successfully logged out. Redirecting to main page..");
      setTimeout(() => {
        signOut({ callbackUrl: "/" });
      }, 1500);
    }
  };

  const toggleAccountVisibility = (accountId) => {
    setVisibleAccounts((prev) => ({
      ...prev,
      [accountId]: !prev[accountId],
    }));
  };

  const handleDelete = async (account_id, account_currency) => {
    const result = await handleDeleteSelectedAccount(session?.accessToken, account_id);
    if (result) {
      setReloadKey((prev) => prev + 1);
      setTimeout(() => {
        swalToast(`Account ${account_currency} has been deleted successfully.`);
      }, 800);
    }
  };

  return (
    <div className="dashboard-container">
      <Card className="dashboard-card">
        <div className="dashboard-header">
          <div className="d-flex justify-content-between">
            <div>
              <h3 className="dashboard-title">Hello, {session?.user?.name}</h3>
              <p className="dashboard-subtitle">Welcome back to your dashboard</p>
            </div>
            <Dropdown>
              <Dropdown.Toggle className="header-dropdown-toggle" size="sm">
                ⋮
              </Dropdown.Toggle>
              <Dropdown.Menu align="end">
                <Dropdown.Item onClick={() => setShowMyCardsAccountModal(true)}>My Cards</Dropdown.Item>
                <Dropdown.Item onClick={() => setShowAddAccountModal(true)}>Add Account</Dropdown.Item>
                <Dropdown.Item onClick={() => setShowEditModal(true)}>Edit Profile</Dropdown.Item>
                <Dropdown.Item onClick={() => setShowExchangeHistoryModal(true)}>Exchange History</Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item className="text-danger" onClick={handleLogout}>Logout</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>

        <Row className="gy-4">
          {accounts.map((account) => (
            <Col md={4} key={account.account_id}>
              <Card className="account-card">
                <Card.Body>
                  <Card.Title className="account-title">
                    Account {account.currency_code}
                  </Card.Title>
                  <div className="account-info d-flex align-items-center justify-content-between">
                    <div>
                      Account Number:{" "}
                      <span className="account-number">
                        {visibleAccounts[account.account_id]
                          ? account.account_number
                          : "XXX-XXX-XXXX"}
                      </span>
                    </div>
                    <Image
                      src={
                        visibleAccounts[account.account_id]
                          ? "/icons/eye/State=Default.svg"
                          : "/icons/eye/State=Dissabled.svg"
                      }
                      alt="Toggle visibility"
                      width={20}
                      height={20}
                      onClick={() => toggleAccountVisibility(account.account_id)}
                      style={{ cursor: "pointer", marginLeft: "10px" }}
                    />
                  </div>
                  <Card.Text className="account-balance">
                    Balance: {account.balance} {account.currency_code}
                  </Card.Text>
                  <div className="d-flex justify-content-end">
                    <Dropdown>
                      <Dropdown.Toggle variant="outline-secondary" size="sm">Options</Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Dropdown.Item
                          onClick={() => {
                            setSelectedCurrencyCode(account.currency_code);
                            setShowDepositModal(true);
                          }}
                          disabled={account.isPlaceholder}
                          title={account.isPlaceholder ? "Placeholder account" : ""}
                        >
                          Deposit Money
                        </Dropdown.Item>
                        <Dropdown.Item
                          onClick={() => {
                            setSelectedCurrencyCode(account.currency_code);
                            setShowDepositHistoryModal(true);
                          }}
                          disabled={account.isPlaceholder}
                          title={account.isPlaceholder ? "Placeholder account" : ""}
                        >
                          Deposit History
                        </Dropdown.Item>
                        <Dropdown.Item
                          onClick={() => {
                            setSelectedCurrencyCode(account.currency_code);
                            setShowWithdrawModal(true);
                          }}
                          disabled={account.isPlaceholder}
                          title={account.isPlaceholder ? "Placeholder account" : ""}
                        >
                          Withdraw Money
                        </Dropdown.Item>
                        <Dropdown.Item
                          onClick={() => {
                            setSelectedCurrencyCode(account.currency_code);
                            setShowWithdrawHistoryModal(true);
                          }}
                          disabled={account.isPlaceholder}
                          title={account.isPlaceholder ? "Placeholder account" : ""}
                        >
                          Withdraw History
                        </Dropdown.Item>
                        <Dropdown.Divider />
                        <Dropdown.Item
                          className="text-danger"
                          onClick={() =>
                            handleDelete(account.account_id, account.currency_code)
                          }
                          disabled={parseFloat(account.balance) > 0 || account.isPlaceholder}
                          title={
                            account.isPlaceholder
                              ? "This is a default placeholder PLN account."
                              : parseFloat(account.balance) > 0
                              ? "You can't delete an account with a non-zero balance."
                              : ""
                          }
                        >
                          Delete
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        <Button
          className="exchange-button w-100"
          onClick={() => setShowExchangeModal(true)}
        >
          Exchange
        </Button>

        <ExchangeModal
          show={showExchangeModal}
          onHide={() => setShowExchangeModal(false)}
          currencyCode={selectedCurrencyCode}
          userId={session?.user?.id}
          token={session?.accessToken}
          onExchangeSuccess={() => setReloadKey((prev) => prev + 1)}
        />

        <MyCardsModal
          show={showMyCardsAccountModal}
          onClose={() => setShowMyCardsAccountModal(false)}
          userId={session?.user?.id}
          token={session?.accessToken}
        />

        <AddAccountModal
          show={showAddAccountModal}
          onHide={() => setShowEditModal(false)}
          onClose={() => setShowAddAccountModal(false)}
          currencyCode={selectedCurrencyCode}
          userId={session?.user?.id}
          token={session?.accessToken}
          onAddSuccess={() => setReloadKey((prev) => prev + 1)}
        />

        <EditProfileModal
          show={showEditModal}
          onHide={() => setShowEditModal(false)}
          userId={session?.user?.id}
          token={session?.accessToken}
          refreshToken={session?.refreshToken}
        />

        <ExchangeHistoryModal
          show={showExchangeHistoryModal}
          onClose={() => setShowExchangeHistoryModal(false)}
          userId={session?.user?.id}
          token={session?.accessToken}
        />

        <DepositHistoryModal
          show={showDepositHistoryModal}
          onClose={() => setShowDepositHistoryModal(false)}
          currencyCode={selectedCurrencyCode}
          userId={session?.user?.id}
          token={session?.accessToken}
        />

        <DepositModal
          show={showDepositModal}
          onClose={() => setShowDepositModal(false)}
          currencyCode={selectedCurrencyCode}
          userId={session?.user?.id}
          token={session?.accessToken}
          onDepositSuccess={() => setReloadKey((prev) => prev + 1)}
        />

        <WithdrawModal
          show={showWithdrawModal}
          onClose={() => setShowWithdrawModal(false)}
          currencyCode={selectedCurrencyCode}
          userId={session?.user?.id}
          token={session?.accessToken}
          onWithdrawSuccess={() => setReloadKey((prev) => prev + 1)}
        />

        <WithdrawHistoryModal
          show={showWithdrawHistoryModal}
          onClose={() => setShowWithdrawHistoryModal(false)}
          currencyCode={selectedCurrencyCode}
          userId={session?.user?.id}
          token={session?.accessToken}
        />
      </Card>
    </div>
  );
};

export default Dashboard;
