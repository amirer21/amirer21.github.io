---
title: 인공지능 - RAG 어플리케이션 구조와 핵심요소
author_profile: true
read_time: true
comments: true
share: true
related: true
categories:
- AI
tags:
- AI
- RAG
toc: true
toc_sticky: true
toc_label: 목차
description: RAG 어플리케이션 구조와 핵심요소
article_tag1: AI
article_tag2: RAG
article_tag3: 
article_section: 
meta_keywords: AI, RAG
last_modified_at: '2024-08-19 21:00:00 +0800'
---

### Key Elements for Developing RAG Applications

The key components and structure critical for developing a RAG (Retrieval-Augmented Generation) application. Each component can be described as follows

1. **Governance & LLMops**:
   - **Role**: This is the foundational layer responsible for data governance and LLMops (Large Language Model operations) in RAG application development. This layer establishes rules for data management and model operations, ensuring the system runs stably.

2. **Data Pipeline**:
   - **Components**:
     - **Parse raw documents**: Analyzes raw documents to extract important data.
     - **Extract document metadata**: Extracts metadata from documents to be used as additional information.
     - **Chunk documents**: Splits documents into smaller chunks to facilitate processing.
     - **Embed documents**: Converts documents into vectors for model processing.
     - **Sync to index**: Synchronizes the processed data with the index to make it searchable.
   - **Role**: Manages the entire data processing flow and prepares raw data in a format that the model can use.

3. **RAG Chain**:
   - **Role**: This is the stage where text is generated based on the retrieved data according to user requests. It includes vector/search indexing, embeddings, and foundational models.
   - **Data Flow**:
     - **User request**: When a user sends a request, it is processed through the RAG Chain.
     - **Vector/search index**: Retrieves data from the vector/search index based on the user's request.
     - **Embedding and foundational models**: Uses models to generate responses based on the retrieved data.
     - **Response to user**: The generated response is sent back to the user.

4. **Evaluation & Monitoring**:
   - **Role**: This stage evaluates and monitors the performance of the RAG system. It reviews the model's outputs and continuously monitors the system for ongoing improvements.

### **Reconstructing the Diagram**

Based on the explanations provided, the structure of a RAG Application can be represented textually as follows:

- **RAG Chain** is the core processing stage where user requests are received, and retrieval and response generation occur.
- **Data Pipeline** prepares and processes data to make it usable by the RAG Chain.
- **Evaluation & Monitoring** continuously evaluates and improves the system's performance.
- **Governance & LLMops** manages the overall system operations and governance.

This diagram helps visually understand the key components to consider when developing and operating a RAG-based application.