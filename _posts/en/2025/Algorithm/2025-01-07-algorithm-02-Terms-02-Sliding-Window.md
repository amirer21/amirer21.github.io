---
title: Algorithm 02 - (Terminology 02) What is Sliding Window?
author_profile: true
read_time: true
comments: true
share: true
related: true
categories:
- Algorithm
tags:
- Algorithm
toc: true
toc_sticky: true
toc_label: Table of Contents
description: Algorithm Problems - What is Sliding Window?
article_tag1: Algorithm
article_tag2: 
article_tag3: 
article_section: 
meta_keywords: Algorithm, 
last_modified_at: '2025-01-07 21:00:00 +0800'
---


### **What is Sliding Window?**

The sliding window is a **highly efficient technique** used to explore a range within arrays or strings. It is especially useful for problems involving **continuous subarrays** or **substrings**. The "window" refers to a certain **range**, and this range is "slid" across the data while performing computations.

This technique can be categorized into two types:
- **Fixed-size window**
- **Variable-size window**

The **window** acts as a **"subset"** or a frame on the data. As it "slides," it captures information for calculations.

---

### **Core Concepts of Sliding Window**

1. **Sliding window** involves dividing an **array** or **string** into fixed or conditionally variable ranges and sliding this range to compute the desired values.

2. **Window size** can be:
   - **Fixed**: The size of the range remains constant while sliding.
   - **Variable**: The size of the range adjusts dynamically based on conditions.

---

### **Examples of Sliding Window Usage**

#### **1. Fixed-size Window**
This type involves a constant window size, and calculations are done while sliding the window to the right. A common example is calculating **subarray sums**.

#### **Example: Calculate Subarray Sum**

**Problem**: Given an array `nums` and size `k`, calculate the sum of all subarrays of size \( k \).

Example: `nums = [1, 2, 3, 4, 5], k = 3`  
The subarray sums are \( 1+2+3 = 6 \), \( 2+3+4 = 9 \), and \( 3+4+5 = 12 \).

**Code Example (Fixed-size Subarray Sum):**

```python
def max_sum_subarray(nums, k):
    window_sum = sum(nums[:k])  # Initial sum of the first window
    max_sum = window_sum

    for i in range(k, len(nums)):
        # Slide the window
        window_sum += nums[i] - nums[i - k]
        max_sum = max(max_sum, window_sum)

    return max_sum

# Test
nums = [1, 2, 3, 4, 5]
k = 3
print(max_sum_subarray(nums, k))  # Output: 12
```

**How it works:**
1. The first window is `[1, 2, 3]` with a sum of `6`.
2. The second window is `[2, 3, 4]` with a sum of `9`.
3. The third window is `[3, 4, 5]` with a sum of `12`.

---

#### **2. Variable-size Window**

In this type, the window size changes dynamically based on conditions. It's commonly used for problems involving finding **subarrays or substrings** that satisfy certain constraints.

#### **Example: Longest Substring Without Repeating Characters**

**Problem**: Find the length of the longest substring without repeating characters in a given string.

**Code Example (Variable-size Sliding Window):**

```python
def longest_substring(s):
    char_set = set()
    left = 0
    max_length = 0

    for right in range(len(s)):
        # If there's a duplicate, move the left pointer to remove it
        while s[right] in char_set:
            char_set.remove(s[left])
            left += 1
        # Add the current character
        char_set.add(s[right])
        # Update the maximum length
        max_length = max(max_length, right - left + 1)

    return max_length

# Test
s = "abcabcbb"
print(longest_substring(s))  # Output: 3
```

**How it works:**
1. The substring starts with `a`, `b`, `c`, giving a length of `3`.
2. When a duplicate `a` appears, the left pointer is moved, reducing the substring to `b, c, a`.
3. Continue sliding and updating the max length for non-repeating substrings.

---

### **Advantages of Sliding Window**

1. **Efficiency**: Most problems can be solved in \( O(n) \), as the window slides only once across the data.
2. **Low Memory Usage**: Only a small subset of data is stored at any time.

---

### **Disadvantages of Sliding Window**

1. **Limited Applicability**: Effective mainly for problems involving arrays or strings with continuous subranges.
2. **Complexity in Conditions**: Dynamically adjusting the window for variable-sized problems can be challenging.

---

### **Tips for Remembering Sliding Window**

1. Visualize the window as a **moving frame**. It slides across the data range, updating computations incrementally.
2. Think of it as a way to avoid recalculating results for the entire dataset repeatedly by **reusing previous results** efficiently.

---

### **Practice Problems**

1. **Problem**: Count subarrays in an array that sum up to a given target.
2. **Problem**: Find the **minimum length of a subarray** in an array that contains a specific set of elements.

---