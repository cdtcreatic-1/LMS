from typing_extensions import List

def estimate_learning_style(answers_list: List):
    '''
    v1.0.0
    '''

    dic_learnings_style = {
        1: "visual",
        2: "auditivo",
        3: "cinestésico"
    }

    # - Extract values
    vals = [d["id_answer"] for d in answers_list]
    # - Counts appearances
    counts = {k: vals.count(k) for k in vals}
    # - Get maximum frecuency
    freq_max = max(counts.values())
    # - Get id for learning style
    id_ls = [k for k in counts.keys() if counts[k] == freq_max][0]
    learning_style = dic_learnings_style[id_ls]
    
    return learning_style
