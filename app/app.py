import streamlit as st
from scripts.search_claim import search_claim

st.set_page_config(page_title="FakeCheck Search", layout="wide")
st.title("FakeCheck Search")

claim = st.text_input("Enter your claim here:")

if claim:
    st.write("Searching for evidence...")
    results = search_claim(claim, top_k=5)
    
    for r in results:
        color = "green" if r['label']=="support" else "red" if r['label']=="refute" else "gray"
        st.markdown(
            f"<p style='color:{color}'><b>{r['label'].upper()}</b>: {r['text']} "
            f"(<a href='{r['url']}'>source</a>)</p>", unsafe_allow_html=True
        )
