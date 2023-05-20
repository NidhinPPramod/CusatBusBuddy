import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../Contexts/AuthContext";
import "./Account.css";
import PenIcon from "../../../images/pen.svg";
import DocIcon from "../../../images/document.svg";
import CashIcon from "../../../images/cash.svg";
import { useUserDetail } from "../../../Contexts/UserContext";
import { Avatar, Skeleton, SkeletonCircle } from "@chakra-ui/react";
import axios from "axios";


function Account() {
  const { logout,currentUser} = useAuth();

  const history = useNavigate();

  const signOut = () => {
    logout();
    history("/login");
    window.location.reload();
  };

  const { values } = useUserDetail();

  const checkoutHandler = async (amount) => {
  
    const {
      data: { key },
    } = await axios.get("http://localhost:4000/api/getkey");

    const {
      data: { order },
    } = await axios.post("http://localhost:4000/api/checkout", {
      amount,uid:currentUser.uid,
    });

    const options = {
      key, // Enter the Key ID generated from the Dashboard
      amount: order.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
      currency: "INR",
      name: "BusBuddy",
      description: "MontlyPayment",
      order_id: order.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
      callback_url: "http://localhost:4000/api/paymentverification",
      prefill: {
        name: "Gaurav Kumar",
        email: "gaurav.kumar@example.com",
        contact: "9000090000",
      },
      notes: {
        address: "Razorpay Corporate Office",
      },
      theme: {
        color: "#121212",
      },
    };
    const razor = new window.Razorpay(options);
    razor.open();
  };

  return (
    <div className="account-card flex flex-col items-center mb-36 px-2 py-2 ">
      <div className="flex w-100 px-2 py-4 my-3 justify-center items-center">
        <div className="mr-5 h-16 w-16">
          {values ? (
            <Avatar src={values.ImageUrl} size="lg" />
          ) : (
            <SkeletonCircle size="20" />
          )}
        </div>
        <div className="flex flex-col text-white tracking-widest text-lg ">
          {values ? (
            <p>
              {values.firstName} {values.lastName}
            </p>
          ) : (
            <p className="font-mono">Loading....</p>
          )}
          {values ? <p>ID:{values.id}</p> : <Skeleton height="20px" />}
        </div>
      </div>
      <div className="flex w-100 justify-around">
        <div
          className="bg-faded-blue rounded-full h-20 w-20 flex justify-center items-center cursor-pointer"
          onClick={() => checkoutHandler(80)}>
          <img src={CashIcon} alt="" className="h-13 w-13 " />
        </div>
        <div
          className="bg-faded-blue rounded-full h-20 w-20 flex justify-center items-center cursor-pointer"
          onClick={() => history("/edit")}>
          <img src={PenIcon} alt="" className="h-8 w-8 " />
        </div>
        <div className="bg-faded-blue rounded-full h-20 w-20 flex justify-center items-center cursor-pointer ">
          <img src={DocIcon} alt="" className="h-8 w-8 " />
        </div>
      </div>
      <div className="flex w-100 justify-around mt-2 text-white tracking-wide font-bold">
        <p>Pay Now!</p>
        <p>Edit Profile</p>
        <p>Feedback</p>
      </div>
      <div className="price text-white text-8xl flex justify-center items-center mt-4 font-black mb-3">
        <p>₹80</p>
      </div>
      <div className="warning-card flex justify-center items-center text-white tracking-widest font-mono font-medium mt-3">
        <p>Bill yet to be paid!</p>
      </div>
      <button
        className="bg-faded-blue text-white rounded-xl px-5 py-2 text-lg mt-4"
        onClick={signOut}>
        LogOut
      </button>
      {/* <Modal isOpen={ispayOpen} onClose={onpayClose} isCentered size="xs">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader className="text-center">Payment</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={12} className="flex items-center justify-center">
            <Payment />
          </ModalBody>
        </ModalContent>
      </Modal> */}
    </div>
  );
}

export default Account;
