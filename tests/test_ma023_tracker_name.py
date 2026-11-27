"""MA-023 tracker name and no-disclosure unit contract."""
from pathlib import Path
import runpy
import unittest

scope=runpy.run_path(str(Path(__file__).resolve().parents[1]/
    "custom_components/gewitterradar/monitored_areas/tracker_names.py"))
candidate=scope["tracker_candidate"]
available=scope["name_availability"]

class TrackerNameTests(unittest.TestCase):
    def test_candidate(self):
        self.assertEqual(candidate("Havanna",str.lower),
                         ("device_tracker.havanna","havanna"))
        self.assertEqual(candidate("Hamburg Nord",lambda n:n.lower().replace(" ","_")),
                         ("device_tracker.hamburg_nord","hamburg_nord"))
    def test_reject_invalid(self):
        for name in ("", " "*4, "x"*121, "😎", 23, None):
            with self.subTest(name=name), self.assertRaises(ValueError):
                candidate(name,lambda n:n if isinstance(n,str) else "")
    def test_collision_privacy(self):
        self.assertEqual(available("device_tracker.havanna",True),
                         {"available":False,"reason":"name_unavailable"})
        self.assertEqual(available("device_tracker.havanna",False),
                         {"available":True,"entity_id":"device_tracker.havanna"})
        with self.assertRaises(ValueError):
            available("device_tracker.havanna",1)

if __name__=="__main__":
    unittest.main()
