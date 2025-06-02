import React, { useState, useRef } from "react";

/**
 * PUBLIC_INTERFACE
 * StudyMate main container: handles file upload, simulated extraction, and MCQ quiz with a dark, student-friendly theme.
 */
function StudyMate() {
  // State for file, error, loading, preview, MCQs, and answers
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileError, setFileError] = useState("");
  const [loading, setLoading] = useState(false);
  const [simText, setSimText] = useState("");
  const [showQuiz, setShowQuiz] = useState(false);
  const [userAnswers, setUserAnswers] = useState({});
  const [mcqs, setMcqs] = useState([]);
  const inputRef = useRef();

  // Color theme constants
  const colors = {
    primary: "#000000",
    secondary: "#FBD46D",
    accent: "#F67280",
    background: "#181818",
    card: "#232323",
    text: "#f0f0f0",
    optionBg: "#26262a",
    border: "#454545",
  };

  // Sample simulated extracted text and MCQs (could randomize for realism)
  const simulatedText = `StudyMate AI identifies the most important concepts in your uploaded document. You can use this generated content and quiz area to prepare for your exams and revision. Example topics: Photosynthesis, World War II, Newton's Laws, and Organic Chemistry.`;

  const sampleMcqs = [
    {
      question: "What is the primary pigment involved in photosynthesis?",
      options: ["Chlorophyll", "Hemoglobin", "Melanin", "Keratin"],
      answer: 0,
      explanation: "Chlorophyll is essential for photosynthesis in plants."
    },
    {
      question: "Which year did World War II end?",
      options: ["1939", "1942", "1945", "1950"],
      answer: 2,
      explanation: "World War II ended in 1945."
    },
    {
      question: "Who formulated the three laws of motion?",
      options: ["Einstein", "Newton", "Galileo", "Maxwell"],
      answer: 1,
      explanation: "Sir Isaac Newton established the laws of motion."
    }
  ];

  // PUBLIC_INTERFACE
  // Handle file selection via click or drop
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    processFile(file);
  };

  // PUBLIC_INTERFACE
  // Handle file drop (drag-n-drop)
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      processFile(file);
    }
  };

  // Check file validity and simulate loading/extraction
  function processFile(file) {
    setFileError("");
    setSelectedFile(null);
    setShowQuiz(false);
    setUserAnswers({});
    if (!file) return;
    const allowed = [".pdf", ".docx"];
    const name = file.name.toLowerCase();
    if (!allowed.some((ext) => name.endsWith(ext))) {
      setFileError("Invalid file type. Please upload a .pdf or .docx file.");
      return;
    }
    setSelectedFile(file);
    setLoading(true);
    // Simulate a short text extraction "delay"
    setTimeout(() => {
      setLoading(false);
      setSimText(simulatedText);
      setMcqs(sampleMcqs);
      setShowQuiz(true);
    }, 1300);
  }

  // PUBLIC_INTERFACE
  // Main MCQ quiz answer handler
  const handleAnswer = (mcqIdx, optIdx) => {
    setUserAnswers((prev) => ({
      ...prev,
      [mcqIdx]: optIdx,
    }));
  };

  // PUBLIC_INTERFACE
  // Download MCQs as PDF (optional, via js)
  const handleDownloadPDF = () => {
    import('jspdf').then(jsPDFModule => {
      const jsPDF = jsPDFModule.default;
      const doc = new jsPDF();
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(18);
      doc.text("Generated MCQs", 15, 18);
      let y = 32;
      doc.setFontSize(13);
      mcqs.forEach((q, idx) => {
        // Question
        doc.setFont(undefined, 'bold');
        doc.text(`${idx + 1}. ${q.question}`, 15, y);
        y += 8;
        q.options.forEach((op, opIdx) => {
          doc.setFont(undefined, 'normal');
          doc.text(
            `    ${String.fromCharCode(65 + opIdx)}) ${op}`,
            20,
            y
          );
          y += 7;
        });
        y += 3;
        // If too low, add new page
        if (y > 270 && idx !== mcqs.length - 1) {
          doc.addPage();
          y = 20;
        }
      });
      doc.save("mcqs.pdf");
    });
  };

  // File upload box style
  const uploadBoxStyle = {
    border: `2px dashed ${colors.secondary}`,
    background: "#191919",
    color: colors.secondary,
    borderRadius: "16px",
    padding: "40px 20px",
    width: "100%",
    minHeight: 200,
    textAlign: "center",
    fontSize: "1.17rem",
    cursor: "pointer",
    marginTop: "28px",
    transition: "border 0.2s",
  };

  // Main card style
  const cardStyle = {
    background: colors.card,
    borderRadius: "20px",
    boxShadow: "0 2px 16px rgba(0,0,0,0.25)",
    padding: "38px 28px 30px 28px",
    maxWidth: 960,
    margin: "42px auto",
  };

  // Responsive two-column grid style
  const twoColStyle = {
    display: "flex",
    gap: 32,
    marginTop: 32,
    flexWrap: "wrap"
  };

  // Left preview pane
  const leftStyle = {
    flex: 1,
    minWidth: 240,
    maxWidth: 410,
    background: "#141414",
    borderRadius: "14px",
    padding: "22px 18px",
    color: colors.text,
    fontFamily: "Inter, sans-serif",
    letterSpacing: "0",
    fontSize: 17,
    boxShadow: "0 1px 6px #0004",
    border: `1.2px solid ${colors.border}`,
    minHeight: 260,
    marginBottom: 24,
  };

  // Right quiz pane
  const rightStyle = {
    flex: 1.1,
    minWidth: 300,
    background: "#18161e",
    borderRadius: "14px",
    padding: "24px 19px",
    color: colors.text,
    boxShadow: "0 1px 8px #0004",
    border: `1.2px solid ${colors.secondary}22`,
    minHeight: 260,
    display: "flex",
    flexDirection: "column",
    marginBottom: 24,
  };

  // App bar (title) styles
  const appBarStyle = {
    padding: "0 0 37px 0",
    textAlign: "center",
  };
  const titleStyle = {
    color: colors.secondary,
    fontWeight: 700,
    fontSize: "2.6rem",
    margin: 0,
    fontFamily: "Poppins, Inter, sans-serif",
    textShadow: "0 2px 10px #0006",
    letterSpacing: "0.02em",
  };
  const subtitleStyle = {
    color: colors.accent,
    fontWeight: 500,
    fontSize: "1.15rem",
    margin: 0,
    marginBottom: "2px"
  };

  // Option button styles
  const optionButtonStyle = (isSelected, isCorrect, showAnswer) => ({
    display: "block",
    width: "100%",
    background: isSelected ? (isCorrect && showAnswer ? "#1ad174" : !isCorrect && showAnswer ? colors.accent : colors.optionBg) : colors.optionBg,
    color: isSelected && showAnswer ? "#fff" : colors.text,
    border: isSelected ? (showAnswer ? `2px solid ${isCorrect ? "#1ad174" : colors.accent}` : `2px solid ${colors.secondary}`) : `2px solid ${colors.border}`,
    borderRadius: "9px",
    padding: "12px 16px",
    textAlign: "left",
    fontSize: 16,
    marginBottom: 13,
    outline: "none",
    cursor: showAnswer ? "not-allowed" : "pointer",
    transition: "all 0.15s"
  });

  // Feedback
  const feedback = (mcqIdx) => {
    if (!(mcqIdx in userAnswers)) return null;
    const sel = userAnswers[mcqIdx];
    const correct = mcqs[mcqIdx].answer;
    if (sel === correct)
      return <div style={{color: "#28e86f", fontWeight: 600, marginTop: 2}}>Correct! 🎉</div>
    else
      return <div style={{color: colors.accent, fontWeight: 600, marginTop: 2}}>Incorrect. {mcqs[mcqIdx].explanation}</div>;
  };

  // Drag events styling
  const [dragActive, setDragActive] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };
  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  // MCQ Download: load jspdf if not present
  function ensureJsPdf() {
    if (!window.jspdf) {
      // Load the library dynamically
      const script = document.createElement('script');
      script.src = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }

  // -- RENDER --
  return (
    <div style={{ minHeight: "100vh", background: colors.primary, padding: 0 }}>
      <div style={appBarStyle}>
        <div style={{marginTop: "34px", marginBottom: "7px"}}>
          <span style={{fontSize: "2.2rem", color: colors.accent, fontWeight: 800, verticalAlign: "top"}}>🪶</span>
        </div>
        <div style={subtitleStyle}>STUDYMATE</div>
        <h1 style={titleStyle}>Smart MCQ Reviser</h1>
        <div style={{
          color: "#b9b9ba",
          fontSize: "1.09rem",
          fontWeight: 400,
          fontFamily: "Inter, sans-serif",
          marginTop: "10px"
        }}>
          Upload your notes (.pdf / .docx), see what matters, and practice with AI-generated MCQs.
        </div>
      </div>
      <div style={{maxWidth: 1000, margin: "0 auto"}}>
        <div style={cardStyle}>
          {
            !simText && (
              // File upload area before extraction
              <div
                style={{
                  ...uploadBoxStyle,
                  border: dragActive ? `2.5px dashed ${colors.accent}` : uploadBoxStyle.border,
                  background: dragActive ? "#15151a" : uploadBoxStyle.background,
                }}
                onDrop={(e) => { handleDrop(e); setDragActive(false); }}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                tabIndex={0}
                onClick={() => inputRef.current && inputRef.current.click()}
                role="button"
                aria-label="Upload file for MCQ generation"
              >
                <div>
                  <div style={{fontSize: "2.5rem", marginBottom: 11, color: colors.secondary, opacity: 0.98}}>📄</div>
                  <div><b>Drag & drop</b> or <b style={{color: colors.accent}}>click to upload</b></div>
                  <div style={{fontSize: "1rem", color: "#b6b6b6", marginTop: 7}}>PDF or DOCX only, max 10MB</div>
                  <input
                    type="file"
                    accept=".pdf,.docx"
                    style={{ display: "none" }}
                    ref={inputRef}
                    onChange={handleFileChange}
                    tabIndex={-1}
                  />
                  {fileError && <div style={{color: colors.accent, marginTop: 8, fontWeight: 500}}>{fileError}</div>}
                  {loading && (
                    <div style={{marginTop: 14, color: "#fff", fontWeight: 600, fontSize: 18}}>
                      <span className="loader" style={{
                        marginRight: 12,
                        border: "4px solid #222",
                        borderTop: `4px solid ${colors.accent}`,
                        borderRadius: "50%",
                        width: 24,
                        height: 24,
                        display: "inline-block",
                        animation: "spin .9s linear infinite",
                        verticalAlign: "middle"
                      }} />
                      Extracting and analyzing...
                    </div>
                  )}
                </div>
              </div>
            )
          }

          {/* After simulated extraction and MCQs */}
          {
            simText && showQuiz && (
              <div style={twoColStyle}>
                {/* Left: Simulated text */}
                <div style={leftStyle}>
                  <div style={{
                      fontWeight: 600, color: colors.secondary, fontSize: 18, marginBottom: 10, letterSpacing: "0.01em"}}>
                    <span style={{marginRight: 7}}>📝</span>Document Preview
                  </div>
                  <div style={{
                    background: "rgba(245,212,109,0.07)",
                    color: "#eeeeef",
                    padding: "13px 13px 16px 12px",
                    fontSize: "1.06rem",
                    borderRadius: "7px",
                    minHeight: 80,
                    boxShadow: "0 1px 5px #0002"
                  }}>
                    {simText}
                  </div>
                  <div style={{
                    marginTop: 17, fontSize: "0.99rem", color: "#b1b1b1"
                  }}>
                    File: <span style={{color: colors.accent}}>{selectedFile?.name}</span>
                  </div>
                  <button
                    style={{
                      background: "#1d2133",
                      color: colors.secondary,
                      border: 0,
                      borderRadius: "7px",
                      marginTop: 16,
                      padding: "9px 20px",
                      fontWeight: 500,
                      cursor: "pointer",
                      fontSize: "0.97rem",
                      letterSpacing: "0.03em"
                    }}
                    onClick={() => { setSimText(""); setShowQuiz(false); setSelectedFile(null); setUserAnswers({}) }}
                  >Upload Another File</button>
                </div>
                {/* Right: MCQ Quiz */}
                <div style={rightStyle}>
                  <div style={{fontWeight: 600, color: colors.secondary, fontSize: 18, marginBottom: 9}}>
                    <span style={{marginRight: 7}}>🧠</span>Practice MCQ Quiz
                  </div>
                  <div>
                    {mcqs.map((mcq, qIdx) => (
                      <div key={qIdx} style={{marginBottom: 25, borderBottom: "1px solid #363643", paddingBottom: 14}}>
                        <div style={{fontWeight: 500, fontSize: 17, color: "#fff", marginBottom: 6}}>
                          {qIdx + 1}. {mcq.question}
                        </div>
                        <div>
                          {mcq.options.map((opt, optIdx) => {
                            const answered = qIdx in userAnswers;
                            const sel = userAnswers[qIdx];
                            const correctIdx = mcq.answer;
                            return (
                              <button
                                type="button"
                                key={optIdx}
                                style={optionButtonStyle(sel === optIdx, optIdx === correctIdx, answered)}
                                disabled={answered}
                                aria-pressed={sel === optIdx}
                                onClick={() => handleAnswer(qIdx, optIdx)}
                              >
                                <b style={{marginRight: 7, color: colors.secondary}}>{String.fromCharCode(65 + optIdx)})</b>
                                <span style={{fontWeight: 500}}>{opt}</span>
                              </button>
                            );
                          })}
                        </div>
                        <div style={{marginTop: 4}}>
                          {feedback(qIdx)}
                        </div>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={handleDownloadPDF}
                    style={{
                      background: colors.secondary,
                      color: colors.primary,
                      border: 0,
                      borderRadius: "10px",
                      fontWeight: 700,
                      fontSize: "1.08rem",
                      padding: "13px 26px",
                      marginTop: "auto",
                      alignSelf: "flex-end",
                      marginRight: "0",
                      boxShadow: "0 2px 12px #0001, 0 1.7px 7px #fbd46d21",
                      cursor: "pointer",
                      transition: "background 0.18s, color 0.18s"
                    }}
                    title="Download MCQs as PDF"
                    aria-label="Download MCQs as PDF"
                  >
                    <span role="img" aria-label="Download" style={{marginRight: 6}}>⬇️</span> Download MCQs as PDF
                  </button>
                </div>
              </div>
            )
          }
        </div>
      </div>
      {/* Spinner animation keyframes */}
      <style>
        {`@keyframes spin {0%{transform:rotate(0deg);}100%{transform:rotate(360deg);}}`}
      </style>
    </div>
  );
}

export default StudyMate;
