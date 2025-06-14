import dedent from 'dedent';

export const SAMPLE_TEMPLATES = [
  {
    title: 'Binary search',
    template: dedent`
    function binarySearch(arr, target) {
      let left = 0;
      let right = arr.length - 1;
      
      while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        
        if (arr[mid] === target) {
          return mid;
        }
        
        if (arr[mid] < target) {
          left = mid + 1;
        } else {
          right = mid - 1;
        }
      }
    `,
  },
  {
    title: 'Bubble sort',
    template: dedent`
    function bubbleSort(arr) {
      const n = arr.length;
      
      for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - i - 1; j++) {
          if (arr[j] > arr[j + 1]) {
            // Swap arr[j] and arr[j+1]
            const temp = arr[j];
            arr[j] = arr[j + 1];
            arr[j + 1] = temp;
          }
        }
      }
    `,
  },
  {
    title: 'Fibonacci sequence',
    template: dedent`
    function fibonacci(n) {
      if (n <= 1) return n;
      return fibonacci(n - 1) + fibonacci(n - 2);
    }
  `,
  },
  {
    title: 'Factorial',
    template: dedent`
    function factorial(n) {
      if (n <= 1) return 1;
      return n * factorial(n - 1);
    }
  `,
  },
  {
    title: 'Quick sort',
    template: dedent`
    function quickSort(arr) {
      if (arr.length <= 1) return arr;
      const pivot = arr[Math.floor(arr.length / 2)];
    }
  `,
  },
  {
    title: 'Merge sort',
    template: dedent`
    function mergeSort(arr) {
      if (arr.length <= 1) return arr;
    }
  `,
  },
  {
    title: 'Linear search',
    template: dedent`
    function linearSearch(arr, target) {
      for (let i = 0; i < arr.length; i++) {
    }
  `,
  },
  {
    title: 'Binary search tree',
    template: dedent`
    class TreeNode {
      constructor(value) {
        this.value = value;
        this.left = null;
        this.right = null;
      }
    }
  `,
  },
  {
    title: 'Binary search tree',
    template: dedent`
    class TreeNode {
      constructor(value) {
        this.value = value;
        this.left = null;
        this.right = null;
      }
    }
  `,
  },
];
