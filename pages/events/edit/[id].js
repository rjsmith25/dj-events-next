import Layout from "@/components/Layout";
import Modal from "@/components/Modal";
import ImageUpload from "@/components/ImageUpload";
import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import { API_URL } from "@/config/index";
import styles from "@/styles/Form.module.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaImage } from "react-icons/fa";
import axios from "axios";
import moment from "moment";
import parseCookies from "@/utils/parseCookies";

export default function EditEventPage({ evt, token }) {
  const router = useRouter();
  const [values, setValues] = useState({
    name: evt.name,
    performers: evt.performers,
    venue: evt.venue,
    address: evt.address,
    date: evt.date,
    time: evt.time,
    description: evt.description,
  });

  const [showModal, setShowModal] = useState(false);

  const [imagePreview, setImagePreview] = useState(
    evt.image ? evt.image.formats.thumbnail.url : null
  );

  async function imageUploaded(e) {
    const res = await axios.get(`${API_URL}/events/${evt.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = res.data;
    setImagePreview(data.image.formats.thumbnail.url);
    setShowModal(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const hasEmptyFields = Object.values(values).some((elem) => {
      return elem === "";
    });

    if (hasEmptyFields) {
      toast.error("Please fill in all fields");
    }

    try {
      const res = await axios.put(`${API_URL}/events/${evt.id}`, values, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const event = res.data;
      router.push(`/events/${event.slug}`);
    } catch (e) {
      console.log(e);
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
      <h1>Edit Event</h1>
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
              value={moment(values.date).format("yyyy-MM-DD")}
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
        <input className="btn" type="submit" value="Update Event" />
      </form>
      <h2>Event Image</h2>
      {imagePreview ? (
        <Image src={imagePreview} height={100} width={170} />
      ) : (
        <div>
          <p>No image uploaded</p>
        </div>
      )}

      <div>
        <button onClick={() => setShowModal(true)} className="btn-secondary">
          <FaImage /> Set Image
        </button>
      </div>
      <Modal show={showModal} onClose={() => setShowModal(false)}>
        <ImageUpload
          evtId={evt.id}
          token={token}
          imageUploaded={imageUploaded}
        />
      </Modal>
    </>
  );
}

export async function getServerSideProps({ params: { id }, req }) {
  const { token } = parseCookies(req);

  if (!token) {
    return {
      redirect: {
        destination: "/account/login",
        permanent: false,
      },
    };
  }

  try {
    const res = await axios.get(`${API_URL}/events/${id}`);

    return {
      props: {
        evt: res.data,
        token,
      },
    };
  } catch (e) {
    console.log(e);
  }
}
