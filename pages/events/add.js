import Layout from "@/components/Layout";
import parseCookies from "@/utils/parseCookies";
import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { API_URL } from "@/config/index";
import styles from "@/styles/Form.module.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

export default function AddEventPage({ token }) {
  const router = useRouter();
  const [values, setValues] = useState({
    name: "",
    performers: "",
    venue: "",
    address: "",
    date: "",
    time: "",
    description: "",
  });

  async function handleSubmit(e) {
    e.preventDefault();
    const hasEmptyFields = Object.values(values).some((elem) => {
      return elem === "";
    });

    if (hasEmptyFields) {
      toast.error("Please fill in all fields");
    }

    try {
      const res = await axios.post(`${API_URL}/events`, values, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const event = res.data;
      router.push(`/events/${event.slug}`);
    } catch (e) {
      if (e.response) {
        if (e.response.status === 403 || e.response.status === 401) {
          toast.error("No token included");
          return;
        }
      }
      toast.error("Something Went Wrong");
    }
  }

  function handleChange(e) {
    setValues({ ...values, [e.target.name]: e.target.value });
  }

  return (
    <>
      <Link href="/events">Go Back</Link>
      <h1>Add Event</h1>
      <ToastContainer />
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.grid}>
          <div>
            <label htmlFor="name">Event Name</label>
            <input
              name="name"
              id="name"
              type="text"
              value={values.name}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="performers">Performers</label>
            <input
              name="performers"
              id="performers"
              type="text"
              value={values.performers}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="venue">Venue</label>
            <input
              type="text"
              name="venue"
              id="venue"
              value={values.venue}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="address">Address</label>
            <input
              type="text"
              name="address"
              id="address"
              value={values.address}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="date">Date</label>
            <input
              type="date"
              name="date"
              id="date"
              value={values.date}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="time">Time</label>
            <input
              type="text"
              name="time"
              id="time"
              value={values.time}
              onChange={handleChange}
            />
          </div>
        </div>
        <div>
          <label htmlFor="description">Event Description</label>
          <textarea
            type="text"
            name="description"
            id="description"
            value={values.description}
            onChange={handleChange}
          ></textarea>
        </div>
        <input className="btn" type="submit" value="Add Event" />
      </form>
    </>
  );
}

export async function getServerSideProps({ req }) {
  const { token } = parseCookies(req);

  if (!token) {
    return {
      redirect: {
        destination: "/account/login",
        permanent: false,
      },
    };
  }
  return {
    props: {
      token,
    },
  };
}
