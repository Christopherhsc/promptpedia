import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Form from "@components/Form";

const EditPrompt = () => {
  const router = useRouter();
  const { id: promptId } = router.query; // using router.query

  const [submitting, setIsSubmitting] = useState(false);
  const [post, setPost] = useState({ prompt: "", tag: "" });

  useEffect(() => {
    if (promptId) {
      const getPromptDetails = async () => {
        try {
          const response = await fetch(`/api/prompt/${promptId}`);
          if (!response.ok) {
            throw new Error('Failed to fetch prompt details');
          }
          const data = await response.json();
          setPost({ prompt: data.prompt, tag: data.tag });
        } catch (error) {
          console.error(error);
          // handle error (e.g., show error message to user)
        }
      };

      getPromptDetails();
    }
  }, [promptId]);

  const updatePrompt = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!promptId) {
      alert("Prompt ID not found");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch(`/api/prompt/${promptId}`, {
        method: "PATCH",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: post.prompt, tag: post.tag }),
      });

      if (!response.ok) {
        throw new Error('Failed to update prompt');
      }

      await router.push("/");
    } catch (error) {
      console.error(error);
      // handle error (e.g., show error message to user)
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form
      type="Edit"
      post={post}
      setPost={setPost}
      submitting={submitting}
      handleSubmit={updatePrompt}
    />
  );
};

export default EditPrompt;
