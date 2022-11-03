from itertools import combinations
import numpy as np

employees = {
    1: 43,
    2: 46,
    3: 47,
    4: 59,
    5: 24,
    6: 44,
    7: 41,
    8: 40,
    9: 43,
    10: 58,
    11: 26,
    12: 47,
    13: 37,
    14: 42,
    15: 60,
    16: 42,
    17: 36,
    18: 36,
    19: 61,
    20: 37}

possible_samples = list(combinations(employees.keys(), 3))


sample_mean = {possible_samples[j]: np.mean(
    [employees[possible_samples[j][i]] for i in range(0, 3)])
    for j in range(0, len(possible_samples))}

cont = 0
with open("sample-means", "w+") as f:
    f.write("<tr>")
    for key, value in sample_mean.items():
        f.write(f"<td>{tuple(f'#{i}' for i in key)}</td>")
        f.write(f"<td>{value:.2f}</td>")
        cont += 1
        if cont % 4 == 0:
            f.write("</tr>")
            f.write("<tr>")
            cont = 0
    f.write("</tr>")
