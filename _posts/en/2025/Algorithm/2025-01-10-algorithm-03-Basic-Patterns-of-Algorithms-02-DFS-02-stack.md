---
title: Algorithm 03 - (Basic Pattern 03) - (2) DFS (Depth-First Search) - What is a Stack?
read_time: true
comments: true
share: true
related: true
categories:
- Algorithm
tags:
- Algorithm
- DFS
- Stack
toc: true
toc_sticky: true
toc_label: Table of Contents
description: Algorithm problems - How to approach and solve algorithm problems effectively?
article_tag1: Algorithm
article_tag2: DFS
article_tag3: Stack
article_section: Algorithm
meta_keywords: Algorithm, DFS
last_modified_at: '2025-01-10 21:00:00 +0800'
---

### **What Is a Stack Algorithm?**

---

### **1. What Is a Stack?**
- A **stack** is a **data structure** that follows the **LIFO (Last In, First Out)** principle.  
  - **LIFO**: The last item added to the stack is the first to be removed.  
  - Example: A stack of plates where the top plate is removed first.

---

### **2. Basic Operations in a Stack**
1. **Push**: Add an item to the top of the stack.
2. **Pop**: Remove the top item from the stack.
3. **Peek** (or **Top**): View the top item without removing it.
4. **isEmpty**: Check if the stack is empty.

---

### **3. Use Cases for a Stack**
- **Valid Parentheses Check**:
  - Ensuring nested parentheses are correctly closed.
- **DFS (Depth-First Search)**:
  - Explicitly implementing recursion using a stack.
- **Postfix Expression Evaluation**:
  - Calculating mathematical expressions in postfix notation.
- **String Reversal**:
  - Reversing a string by pushing characters onto a stack and popping them.

---

### **4. Problem Example: Valid Parentheses Check**

#### **Problem Description**
Check if a given string contains valid parentheses.  
The string includes only the characters `()`, `{}`, and `[]`.

#### **Input**
- Examples: `"()[]{}"`, `"(]"`, `"([{}])"`

#### **Output**
- Valid parentheses: `True`
- Invalid parentheses: `False`

---

### **5. Solution Using a Stack**

#### **Approach**
1. Push **opening brackets** (`(`, `{`, `[`) onto the stack.
2. When encountering **closing brackets** (`)`, `}`, `]`):
   - Compare them with the **top item** on the stack.
   - If they form a pair, pop the stack.
   - If they do not match or the stack is empty, the parentheses are invalid.

#### **Code**
```python
def is_valid(s):
    stack = []
    mapping = {')': '(', '}': '{', ']': '['}  # Matching pairs

    for char in s:
        if char in mapping:  # Closing bracket
            top = stack.pop() if stack else '#'  # Pop or use default
            if mapping[char] != top:  # If mismatch
                return False
        else:  # Opening bracket
            stack.append(char)  # Push to stack

    return not stack  # Valid if stack is empty
```

---

### **6. Execution Process Output**

#### **Input String: `"([{}])"`**

```python
def is_valid(s):
    stack = []
    mapping = {')': '(', '}': '{', ']': '['}
    
    for char in s:
        print(f"Current character: {char}")
        if char in mapping:
            top = stack.pop() if stack else '#'
            print(f" - Popped from stack: {top}")
            if mapping[char] != top:
                print(f" - Mismatch: {char} does not match {top}")
                return False
        else:
            stack.append(char)
            print(f" - Added to stack: {stack}")
    
    print(f"Final stack state: {stack}")
    return not stack

# Test Run
print(is_valid("([{}])"))  # Output: True
```

#### **Output**
```
Current character: (
 - Added to stack: ['(']
Current character: [
 - Added to stack: ['(', '[']
Current character: {
 - Added to stack: ['(', '[', '{']
Current character: }
 - Popped from stack: {
Current character: ]
 - Popped from stack: [
Current character: )
 - Popped from stack: (
Final stack state: []
True
```

---

### **7. Step-by-Step Problem Solving**

1. Add opening brackets to the **stack**.
2. For closing brackets:
   - Compare the top item of the stack.
   - If matched, remove the top item (pop).
   - If mismatched, the parentheses are invalid.
3. At the end of the string:
   - If the stack is empty, all brackets are matched → `True`.
   - If the stack is not empty, unmatched brackets remain → `False`.

---

### **8. Key Insights and Easy Memorization**

#### **Core Ideas of a Stack**
1. **"Add and Remove"**:
   - Add items to the stack and remove the most recently added item first (LIFO).
2. **"Closing Brackets Match the Top of the Stack"**:
   - For parentheses problems, closing brackets must match the most recent opening bracket.

#### **Memorization Tips**
- "Stack is LIFO: Last In, First Out."
- "Push opening brackets, pop for closing brackets, and match."

#### **Example Visualization**
- Input: `"([{}])"`
```plaintext
Stack State:
1. Push '(' → ['(']
2. Push '[' → ['(', '[']
3. Push '{' → ['(', '[', '{']
4. Pop '}' → ['(', '[']
5. Pop ']' → ['(']
6. Pop ')' → []
Final: Stack is empty → True
```

---

### **9. Practice Problems**

1. **Valid Parentheses**
   - Input: `"({[]})"`, `"([)]"`
   - Output: `True`, `False`

2. **String Reversal**
   - Input: `"hello"`
   - Output: `"olleh"`

3. **Postfix Expression Evaluation**
   - Input: `"2 3 + 4 *"`
   - Output: `20`

---